import { useAuthStore } from "@/features/auth/application/auth-store";
import { useProductAddedDialogStore } from "@/features/carts/application/use-product-added-dialog-store";
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
  const onOpen = useProductAddedDialogStore((store) => store.onOpen);

  const addToCart = async (productId: string) => {
    if (!isAuthenticated) {
      notifyNotAuthenticated();
      return;
    }

    try {
      await mutateAsync(cartId, { productId, quantity: 1 });
      notifySuccess();
      onOpen(cartId);
    } catch (e) {
      if (e instanceof UnknownProductError) {
        notifyUnknownProduct();
        return;
      }

      // todo: not implemented yet on the backend
      if (e instanceof ProductNotAvailableError) {
        notifyProductNotAvailable();
        return;
      }

      notifyFailure();
    }
  };

  return { addToCart, isPending };
};
