import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cartQueryKeys } from "@/lib/api/carts/cart-query-keys";
import {
  addToCartMutationOptions,
  type AddToCartPayload,
} from "@/lib/api/carts/{cart-id}/add-to-cart-mutation";

export {
  UnknownProductError,
  ProductNotAvailableError,
} from "@/lib/api/carts/{cart-id}/add-to-cart-mutation";

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    ...addToCartMutationOptions,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
    },
  });

  const handler = (cartId: string, payload: AddToCartPayload) =>
    mutateAsync({ cartId, payload });

  return [handler, isPending] as const;
};
