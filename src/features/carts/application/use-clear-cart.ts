import { useAuthStore } from "@/features/auth/application/auth-store";
import { useClearCartMutation } from "@/features/carts/providers/use-clear-cart-mutation";

import { useClearCartNotifications } from "./use-clear-cart-notifications";

export const useClearCart = () => {
  const cartId = useAuthStore((store) => store.user?.cartId);
  const [mutateAsync, isPending] = useClearCartMutation();
  const { notifySuccess, notifyFailure } = useClearCartNotifications();

  const clearCart = async (): Promise<boolean> => {
    if (!cartId) return false;

    try {
      await mutateAsync({ cartId });
      notifySuccess();
      return true;
    } catch {
      notifyFailure();
      return false;
    }
  };

  return { clearCart, isPending };
};
