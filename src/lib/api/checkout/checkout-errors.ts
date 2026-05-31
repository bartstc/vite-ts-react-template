import type {
  OutOfStockItem,
  PriceChange,
} from "@/lib/api/checkout/checkout-session-dto";

// AIDEV-NOTE: One Error subclass per typed checkout outcome — mirrors the lib/api error
// convention (e.g. UnknownProductError). The mutation factories throw these (translated
// from the 400 body by parse-checkout-error); the machine branches on `instanceof`. See 003.

export class EmptyCartError extends Error {
  constructor() {
    super("Cart is empty");
    this.name = "EmptyCartError";
  }
}

export class OutOfStockError extends Error {
  constructor(readonly items: OutOfStockItem[]) {
    super("Some items are out of stock");
    this.name = "OutOfStockError";
  }
}

export class PriceChangedError extends Error {
  constructor(readonly changes: PriceChange[]) {
    super("Prices have changed");
    this.name = "PriceChangedError";
  }
}

export class SessionExpiredError extends Error {
  constructor() {
    super("Checkout session has expired");
    this.name = "SessionExpiredError";
  }
}

export class PromoInvalidError extends Error {
  constructor() {
    super("Promo code is invalid");
    this.name = "PromoInvalidError";
  }
}

export type CheckoutError =
  | EmptyCartError
  | OutOfStockError
  | PriceChangedError
  | SessionExpiredError
  | PromoInvalidError;
