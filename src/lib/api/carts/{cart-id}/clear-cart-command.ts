import { useMutation } from "@tanstack/react-query";

import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";

interface IClearCartValues {
  cartId: number;
}

export const useClearCartMutation = () => {
  const { mutateAsync, isPending } = useMutation<
    void,
    unknown,
    IClearCartValues
  >({
    mutationFn: (body) => httpService.delete(`carts/${body.cartId}`),
  });

  const handler = (body: IClearCartValues) => {
    return mutateAsync(body)
      .then(async () => {
        // optionally mutate related data
      })
      .catch((e) => {
        // listen for a specific error and act respectively (e.g. throwing a specific error and catch it later)

        // notify backend about the error if needed
        Logger.error("An error occurred during clearing the cart", e as Error);

        throw e;
      });
  };

  return [handler, isPending] as const;
};
