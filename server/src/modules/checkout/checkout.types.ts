import type { MoneyDto } from "@/modules/products/products.types.js";
import type { Cart, CartProduct } from "@/modules/carts/carts.types.js";

// AIDEV-NOTE: checkout depends on carts read-only (Cart/CartProduct types + cart data).
// carts never imports checkout. See specs/003-checkout-process.
export type { Cart, CartProduct };

export const SHIPPING_OPTIONS = ["standard", "express"] as const;
export type ShippingOption = (typeof SHIPPING_OPTIONS)[number];

export interface CheckoutLineItem {
  productId: string;
  name: string;
  unitPrice: MoneyDto;
  quantity: number;
  lineTotal: MoneyDto;
}

export type CheckoutStatus = "pending" | "confirmed";

// AIDEV-NOTE: session is stateless — returned to the client and replayed back into
// apply/confirm. Server stores nothing (no persistence this iteration).
export interface CheckoutSession {
  id: string;
  cartId: string;
  status: CheckoutStatus;
  lineItems: CheckoutLineItem[];
  promoCode: string | null;
  shippingOption: ShippingOption;
  subtotal: MoneyDto;
  discount: MoneyDto;
  shipping: MoneyDto;
  total: MoneyDto;
  expiresAt: string;
}

export interface Order {
  id: string;
  cartId: string;
  userId: number;
  status: "confirmed";
  lineItems: CheckoutLineItem[];
  subtotal: MoneyDto;
  discount: MoneyDto;
  shipping: MoneyDto;
  total: MoneyDto;
  promoCode: string | null;
  shippingOption: ShippingOption;
  confirmedAt: string;
}

// Discriminated error union — returned as HTTP 400 with `code` as the discriminant.
export type CheckoutErrorCode =
  | "EmptyCart"
  | "OutOfStock"
  | "PriceChanged"
  | "SessionExpired"
  | "PromoInvalid";

export interface PriceChange {
  productId: string;
  was: MoneyDto;
  now: MoneyDto;
}

export interface OutOfStockItem {
  productId: string;
  requested: number;
  available: number;
}

export interface CheckoutError {
  code: CheckoutErrorCode;
  message: string;
  // Populated only for the relevant code.
  changes?: PriceChange[];
  items?: OutOfStockItem[];
}

export interface InitiateBody {
  cartId: string;
}

export interface ApplyBody {
  session: CheckoutSession;
  promoCode?: string;
  shippingOption?: ShippingOption;
}

export interface ConfirmBody {
  session: CheckoutSession;
}
