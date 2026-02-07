import { useAuthStore } from "@/features/auth/application/authStore";
import { useAddToCartMutation } from "@/lib/api/carts/{cart-id}/add-to-cart-command";

interface IAddToCartValues {
  productId: number;
  quantity?: number;
}

export const useAddToCart = () => {
  const cartId = useAuthStore((store) => store.user?.cartId);
  const userId = useAuthStore((store) => store.user?.id);
  const [mutateAsync, isLoading] = useAddToCartMutation();

  const handler = (body: IAddToCartValues) => {
    if (!cartId || !userId) {
      throw new Error("User not authenticated");
    }
    return mutateAsync({ ...body, cartId, userId });
  };

  return [handler, isLoading] as const;
};
