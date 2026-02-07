import { useAuthStore } from "@/features/auth/application/authStore";
import { useClearCartMutation } from "@/lib/api/carts/{cart-id}/clear-cart-command";

export const useClearCart = () => {
  const cartId = useAuthStore((store) => store.user.cartId);
  const [mutateAsync, isLoading] = useClearCartMutation();

  const handler = () => {
    if (!cartId) {
      throw new Error("User not authenticated");
    }
    return mutateAsync({ cartId });
  };

  return [handler, isLoading] as const;
};
