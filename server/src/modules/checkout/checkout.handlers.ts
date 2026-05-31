import type { FastifyReply, FastifyRequest } from "fastify";
import { getDb } from "@/db/database.js";
import type { Product, MoneyDto } from "@/modules/products/products.types.js";
import type { Cart } from "@/modules/carts/carts.types.js";
import type {
  ApplyBody,
  CheckoutError,
  CheckoutLineItem,
  CheckoutSession,
  ConfirmBody,
  InitiateBody,
  Order,
  OutOfStockItem,
  PriceChange,
  ShippingOption,
} from "@/modules/checkout/checkout.types.js";

// AIDEV-NOTE: USD only this iteration — single currency assumed throughout (003).
const CURRENCY = "USD" as const;
const SESSION_TTL_MS = 15 * 60 * 1000;

const SHIPPING_COST: Record<ShippingOption, number> = {
  standard: 5,
  express: 15,
};

// Fixed test promo table. PROMO not here → PromoInvalid.
const PROMOS: Record<string, (subtotal: number) => Partial<PromoEffect>> = {
  SAVE10: (subtotal) => ({ discount: round(subtotal * 0.1) }),
  FREESHIP: () => ({ freeShipping: true }),
};

interface PromoEffect {
  discount: number;
  freeShipping: boolean;
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function money(amount: number): MoneyDto {
  return { amount: round(amount), currency: CURRENCY };
}

function sendError(reply: FastifyReply, error: CheckoutError): void {
  reply.code(400).send(error);
}

// Build priced line items from the cart against current product data.
// Returns either line items or an out-of-stock error payload.
function repriceCart(
  cart: Cart,
  products: Product[]
):
  | { ok: true; lineItems: CheckoutLineItem[] }
  | { ok: false; items: OutOfStockItem[] } {
  const lineItems: CheckoutLineItem[] = [];
  const outOfStock: OutOfStockItem[] = [];

  for (const item of cart.products) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      // Unknown product behaves like zero availability.
      outOfStock.push({
        productId: item.productId,
        requested: item.quantity,
        available: 0,
      });
      continue;
    }

    if (product.stock < item.quantity) {
      outOfStock.push({
        productId: item.productId,
        requested: item.quantity,
        available: product.stock,
      });
      continue;
    }

    lineItems.push({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      lineTotal: money(product.price.amount * item.quantity),
    });
  }

  if (outOfStock.length > 0) {
    return { ok: false, items: outOfStock };
  }
  return { ok: true, lineItems };
}

// Compute subtotal / discount / shipping / total for a set of line items.
function computeTotals(
  lineItems: CheckoutLineItem[],
  promoCode: string | null,
  shippingOption: ShippingOption
): Pick<CheckoutSession, "subtotal" | "discount" | "shipping" | "total"> {
  const subtotal = round(
    lineItems.reduce((sum, li) => sum + li.lineTotal.amount, 0)
  );

  let discount = 0;
  let shipping = SHIPPING_COST[shippingOption];

  if (promoCode) {
    const effect = PROMOS[promoCode](subtotal);
    if (effect.discount) discount = effect.discount;
    if (effect.freeShipping) shipping = 0;
  }

  const total = Math.max(0, round(subtotal - discount + shipping));

  return {
    subtotal: money(subtotal),
    discount: money(discount),
    shipping: money(shipping),
    total: money(total),
  };
}

export async function initiateCheckoutHandler(
  request: FastifyRequest<{ Body: InitiateBody }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const cart = db.data.carts.find((c) => c.id === request.body.cartId);

  if (!cart) {
    reply.code(404).send({ message: "Cart not found" });
    return;
  }

  if (cart.products.length === 0) {
    sendError(reply, { code: "EmptyCart", message: "Cart is empty" });
    return;
  }

  const priced = repriceCart(cart, db.data.products);
  if (!priced.ok) {
    sendError(reply, {
      code: "OutOfStock",
      message: "One or more items are out of stock",
      items: priced.items,
    });
    return;
  }

  const shippingOption: ShippingOption = "standard";
  const totals = computeTotals(priced.lineItems, null, shippingOption);

  const session: CheckoutSession = {
    id: crypto.randomUUID(),
    cartId: cart.id,
    status: "pending",
    lineItems: priced.lineItems,
    promoCode: null,
    shippingOption,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    ...totals,
  };

  reply.send(session);
}

export async function applyCheckoutHandler(
  request: FastifyRequest<{ Body: ApplyBody }>,
  reply: FastifyReply
): Promise<void> {
  const { session, promoCode, shippingOption } = request.body;

  const nextPromo = promoCode ?? session.promoCode;
  if (nextPromo && !(nextPromo in PROMOS)) {
    sendError(reply, {
      code: "PromoInvalid",
      message: `Unknown promo code: ${nextPromo}`,
    });
    return;
  }

  const nextShipping = shippingOption ?? session.shippingOption;
  const totals = computeTotals(session.lineItems, nextPromo, nextShipping);

  const updated: CheckoutSession = {
    ...session,
    promoCode: nextPromo,
    shippingOption: nextShipping,
    ...totals,
  };

  reply.send(updated);
}

export async function confirmCheckoutHandler(
  request: FastifyRequest<{ Body: ConfirmBody }>,
  reply: FastifyReply
): Promise<void> {
  const { session } = request.body;
  const db = await getDb();

  if (Date.parse(session.expiresAt) < Date.now()) {
    sendError(reply, {
      code: "SessionExpired",
      message: "Checkout session has expired",
    });
    return;
  }

  const cart = db.data.carts.find((c) => c.id === session.cartId);
  if (!cart) {
    reply.code(404).send({ message: "Cart not found" });
    return;
  }

  // Re-validate stock against current data.
  const priced = repriceCart(cart, db.data.products);
  if (!priced.ok) {
    sendError(reply, {
      code: "OutOfStock",
      message: "One or more items are out of stock",
      items: priced.items,
    });
    return;
  }

  // Compare session prices against fresh prices → PriceChanged.
  const changes: PriceChange[] = [];
  for (const sessionItem of session.lineItems) {
    const fresh = priced.lineItems.find(
      (li) => li.productId === sessionItem.productId
    );
    if (fresh && fresh.unitPrice.amount !== sessionItem.unitPrice.amount) {
      changes.push({
        productId: sessionItem.productId,
        was: sessionItem.unitPrice,
        now: fresh.unitPrice,
      });
    }
  }

  if (changes.length > 0) {
    sendError(reply, {
      code: "PriceChanged",
      message: "Prices changed since checkout was started",
      changes,
    });
    return;
  }

  const cartIndex = db.data.carts.findIndex((c) => c.id === cart.id);
  const now = new Date().toISOString();

  const order: Order = {
    id: crypto.randomUUID(),
    cartId: cart.id,
    userId: cart.userId,
    status: "confirmed",
    lineItems: session.lineItems,
    subtotal: session.subtotal,
    discount: session.discount,
    shipping: session.shipping,
    total: session.total,
    promoCode: session.promoCode,
    shippingOption: session.shippingOption,
    confirmedAt: now,
  };

  // AIDEV-NOTE: clear cart inline (not via clearCartHandler) to avoid handler coupling.
  await db.update((data) => {
    data.carts[cartIndex] = { ...cart, products: [], date: now };
  });

  reply.code(201).send(order);
}
