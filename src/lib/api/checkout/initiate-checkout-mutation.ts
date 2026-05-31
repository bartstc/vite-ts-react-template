import { mutationOptions } from "@tanstack/react-query";

import type { CheckoutSession } from "@/lib/api/checkout/checkout-session-dto";
import { parseCheckoutError } from "@/lib/api/checkout/parse-checkout-error";
import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";

export interface InitiateCheckoutPayload {
  cartId: string;
}

export const initiateCheckout = async ({
  cartId,
}: InitiateCheckoutPayload): Promise<CheckoutSession> => {
  try {
    return await httpService.post<CheckoutSession, InitiateCheckoutPayload>(
      "checkout/initiate",
      { cartId }
    );
  } catch (e) {
    Logger.error("Failed to initiate checkout", e as Error);
    throw parseCheckoutError(e);
  }
};

export const initiateCheckoutMutationOptions = mutationOptions({
  mutationFn: initiateCheckout,
});
