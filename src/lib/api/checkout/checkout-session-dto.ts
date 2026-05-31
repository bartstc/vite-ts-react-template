// AIDEV-NOTE: Wire types mirroring the server checkout contract 1:1
// (server/src/modules/checkout/checkout.types.ts). No transformations. See 003.

export interface Money {
  amount: number;
  currency: string;
}

export const SHIPPING_OPTIONS = ["standard", "express"] as const;
export type ShippingOption = (typeof SHIPPING_OPTIONS)[number];

export interface CheckoutLineItem {
  productId: string;
  name: string;
  unitPrice: Money;
  quantity: number;
  lineTotal: Money;
}

export type CheckoutStatus = "pending" | "confirmed";

// AIDEV-NOTE: session is stateless — returned by initiate/apply and replayed back into
// apply/confirm. The machine carries it in context; the server stores nothing.
export interface CheckoutSession {
  id: string;
  cartId: string;
  status: CheckoutStatus;
  lineItems: CheckoutLineItem[];
  promoCode: string | null;
  shippingOption: ShippingOption;
  subtotal: Money;
  discount: Money;
  shipping: Money;
  total: Money;
  expiresAt: string;
}

export interface PriceChange {
  productId: string;
  was: Money;
  now: Money;
}

export interface OutOfStockItem {
  productId: string;
  requested: number;
  available: number;
}
