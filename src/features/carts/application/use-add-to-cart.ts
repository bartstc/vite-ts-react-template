import { useAuthStore } from "@/features/auth/application/auth-store";
import {
  useAddToCartMutation,
  UnknownProductError,
  ProductNotAvailableError,
} from "@/features/carts/providers/use-add-to-cart-mutation";

import { useAddToCartNotifications } from "./use-add-to-cart-notifications";

export const useAddToCart = () => {
  const cartId = useAuthStore((store) => store.user?.cartId);
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const [mutateAsync, isPending] = useAddToCartMutation();
  const {
    notifySuccess,
    notifyFailure,
    notifyNotAuthenticated,
    notifyUnknownProduct,
    notifyProductNotAvailable,
  } = useAddToCartNotifications();

  const addToCart = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      notifyNotAuthenticated();
      return false;
    }

    try {
      await mutateAsync(cartId, { productId, quantity: 1 });
      notifySuccess();
      return true;
    } catch (e) {
      if (e instanceof UnknownProductError) {
        notifyUnknownProduct();
        return false;
      }

      // todo: not implemented yet on the backend
      if (e instanceof ProductNotAvailableError) {
        notifyProductNotAvailable();
        return false;
      }

      notifyFailure();
      return false;
    }
  };

  return { addToCart, isPending };
};
