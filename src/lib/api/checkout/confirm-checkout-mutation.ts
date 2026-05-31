import { mutationOptions } from "@tanstack/react-query";

import type { CheckoutSession } from "@/lib/api/checkout/checkout-session-dto";
import type { Order } from "@/lib/api/checkout/order-dto";
import { parseCheckoutError } from "@/lib/api/checkout/parse-checkout-error";
import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";

export interface ConfirmCheckoutPayload {
  session: CheckoutSession;
}

export const confirmCheckout = async ({
  session,
}: ConfirmCheckoutPayload): Promise<Order> => {
  try {
    return await httpService.post<Order, ConfirmCheckoutPayload>(
      "checkout/confirm",
      { session }
    );
  } catch (e) {
    Logger.error("Failed to confirm checkout", e as Error);
    throw parseCheckoutError(e);
  }
};

export const confirmCheckoutMutationOptions = mutationOptions({
  mutationFn: confirmCheckout,
});
