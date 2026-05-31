// AIDEV-NOTE: Domain errors re-exported from the API layer, where they're thrown by the
// checkout mutation factories (errors co-locate with the factory that throws them, per the
// mutation-options-factory rule). The machine branches on these via `instanceof`. See 003.
export {
  type CheckoutError,
  EmptyCartError,
  OutOfStockError,
  PriceChangedError,
  PromoInvalidError,
  SessionExpiredError,
} from "@/lib/api/checkout/checkout-errors";
