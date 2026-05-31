import type { CheckoutErrorDto } from "@/lib/api/checkout/checkout-error-dto";
import {
  type CheckoutError,
  EmptyCartError,
  OutOfStockError,
  PriceChangedError,
  PromoInvalidError,
  SessionExpiredError,
} from "@/lib/api/checkout/checkout-errors";
import { AjaxError } from "@/lib/http/ajax-error";
import { UnknownError } from "@/lib/types/unknown-error";

// AIDEV-NOTE: Translates a caught request error into a typed checkout error. Branches on
// the 400 body `code` (read off AjaxError.body) — not the message, since PromoInvalid's
// server message is dynamic. Anything non-checkout (404, network, no code) → UnknownError.
export const parseCheckoutError = (
  error: unknown
): CheckoutError | UnknownError => {
  const body = error instanceof AjaxError ? error.body : undefined;
  const dto = isCheckoutErrorDto(body) ? body : undefined;

  switch (dto?.code) {
    case "EmptyCart":
      return new EmptyCartError();
    case "OutOfStock":
      return new OutOfStockError(dto.items ?? []);
    case "PriceChanged":
      return new PriceChangedError(dto.changes ?? []);
    case "SessionExpired":
      return new SessionExpiredError();
    case "PromoInvalid":
      return new PromoInvalidError();
    default:
      return new UnknownError();
  }
};

const isCheckoutErrorDto = (body: unknown): body is CheckoutErrorDto =>
  typeof body === "object" &&
  body !== null &&
  "code" in body &&
  typeof body.code === "string";
