import { mutationOptions } from "@tanstack/react-query";

import type {
  CheckoutSession,
  ShippingOption,
} from "@/lib/api/checkout/checkout-session-dto";
import { parseCheckoutError } from "@/lib/api/checkout/parse-checkout-error";
import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";

export interface ApplyCheckoutPayload {
  session: CheckoutSession;
  promoCode?: string;
  shippingOption?: ShippingOption;
}

export const applyCheckout = async (
  payload: ApplyCheckoutPayload
): Promise<CheckoutSession> => {
  try {
    return await httpService.post<CheckoutSession, ApplyCheckoutPayload>(
      "checkout/apply",
      payload
    );
  } catch (e) {
    Logger.error("Failed to apply checkout changes", e as Error);
    throw parseCheckoutError(e);
  }
};

export const applyCheckoutMutationOptions = mutationOptions({
  mutationFn: applyCheckout,
});
