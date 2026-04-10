import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cartQueryKeys } from "@/lib/api/carts/cart-query-keys";
import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";

interface IClearCartValues {
  cartId: string;
}

export const useClearCartMutation = () => {
  const queryClient = useQueryClient();
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
        await queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
      })
      .catch((e) => {
        Logger.error("An error occurred during clearing the cart", e as Error);

        throw e;
      });
  };

  return [handler, isPending] as const;
};
