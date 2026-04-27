import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cartQueryKeys } from "@/lib/api/carts/cart-query-keys";
import { removeCartProductMutationOptions } from "@/lib/api/carts/{cart-id}/remove-cart-product-mutation";

export const useRemoveAllCartProductsMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation(
    removeCartProductMutationOptions
  );

  const handler = async (
    cartId: string,
    productId: string,
    quantity: number
  ): Promise<void> => {
    try {
      for (let i = 0; i < quantity; i++) {
        await mutateAsync({ cartId, productId });
      }
    } finally {
      await queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
    }
  };

  return [handler, isPending] as const;
};
