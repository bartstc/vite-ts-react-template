import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cartQueryKeys } from "@/lib/api/carts/cart-query-keys";
import type { CartProductDto } from "@/lib/api/carts/{cart-id}/cart-product-dto";
import {
  removeCartProductMutationOptions,
  type RemoveCartProductDto,
} from "@/lib/api/carts/{cart-id}/remove-cart-product-mutation";

interface CartProductsCache {
  date: string;
  products: CartProductDto[];
}

interface MutationContext {
  previous: CartProductsCache | undefined;
  cartId: string;
}

export { ProductNotFoundInCartError } from "@/lib/api/carts/{cart-id}/remove-cart-product-mutation";

export const useRemoveCartProductMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    void,
    Error,
    RemoveCartProductDto,
    MutationContext
  >({
    ...removeCartProductMutationOptions,
    onMutate: async ({ cartId, productId }) => {
      const queryKey = cartQueryKeys.products(cartId);
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<CartProductsCache>(queryKey);

      if (previous) {
        queryClient.setQueryData<CartProductsCache>(queryKey, {
          ...previous,
          products: previous.products.map((p) =>
            p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
          ),
        });
      }

      return { previous, cartId };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          cartQueryKeys.products(context.cartId),
          context.previous
        );
      }
    },
    onSettled: (_data, _err, { cartId }) => {
      void queryClient.invalidateQueries({
        queryKey: cartQueryKeys.products(cartId),
      });
    },
  });

  const handler = (cartId: string, productId: string) =>
    mutateAsync({ cartId, productId });

  return [handler, isPending] as const;
};
