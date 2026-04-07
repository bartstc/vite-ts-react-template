import { useAuthStore } from "@/features/auth/application/auth-store";
import {
  useAddToCartMutation,
  UnknownProductError,
  ProductNotAvailableError,
} from "@/lib/api/carts/{cart-id}/add-to-cart-command";
import { UnauthorizedError } from "@/lib/types/unauthorized-error";

interface AddToCartPayload {
  productId: number;
  quantity?: number;
}

export const useAddToCart = () => {
  const cartId = useAuthStore((store) => store.user?.cartId);
  const userId = useAuthStore((store) => store.user?.id);
  const [mutateAsync, isLoading] = useAddToCartMutation();

  const handler = (body: AddToCartPayload) => {
    if (!cartId || !userId) {
      throw new UnauthorizedError();
    }
    return mutateAsync(cartId, body);
  };

  return [handler, isLoading] as const;
};

export { UnknownProductError, ProductNotAvailableError };
