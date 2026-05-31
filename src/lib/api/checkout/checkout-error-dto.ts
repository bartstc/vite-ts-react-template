import type {
  OutOfStockItem,
  PriceChange,
} from "@/lib/api/checkout/checkout-session-dto";

// AIDEV-NOTE: discriminated error union returned as HTTP 400 with `code` as the
// discriminant. Mirrors server CheckoutError; `changes`/`items` populated per code.
export type CheckoutErrorCode =
  | "EmptyCart"
  | "OutOfStock"
  | "PriceChanged"
  | "SessionExpired"
  | "PromoInvalid";

export interface CheckoutErrorDto {
  code: CheckoutErrorCode;
  message: string;
  changes?: PriceChange[];
  items?: OutOfStockItem[];
}
