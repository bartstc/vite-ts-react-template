import { useAuthStore } from "@/features/auth/application/auth-store";
import { useRemoveAllCartProductsMutation } from "@/features/carts/providers/use-remove-all-cart-products-mutation";
import {
  ProductNotFoundInCartError,
  useRemoveCartProductMutation,
} from "@/features/carts/providers/use-remove-cart-product-mutation";

import { useRemoveCartProductNotifications } from "./use-remove-cart-product-notifications";

export const useRemoveCartProduct = () => {
  const cartId = useAuthStore((store) => store.user?.cartId);
  const [removeSingle, isRemoveSinglePending] = useRemoveCartProductMutation();
  const [removeAll, isRemoveAllPending] = useRemoveAllCartProductsMutation();
  const {
    notifyDecrementSuccess,
    notifyRemoveAllSuccess,
    notifyProductNotFoundError,
    notifyFailure,
  } = useRemoveCartProductNotifications();

  const removeOneFromCart = async (productId: string): Promise<boolean> => {
    if (!cartId) return false;
    try {
      await removeSingle(cartId, productId);
      notifyDecrementSuccess();
      return true;
    } catch (e) {
      if (e instanceof ProductNotFoundInCartError) {
        notifyProductNotFoundError();
      } else {
        notifyFailure();
      }
      return false;
    }
  };

  const removeAllFromCart = async (
    productId: string,
    quantity: number
  ): Promise<boolean> => {
    if (!cartId) return false;
    try {
      await removeAll(cartId, productId, quantity);
      notifyRemoveAllSuccess();
      return true;
    } catch (e) {
      if (e instanceof ProductNotFoundInCartError) {
        notifyProductNotFoundError();
      } else {
        notifyFailure();
      }
      return false;
    }
  };

  return {
    removeOneFromCart,
    removeAllFromCart,
    isPending: isRemoveSinglePending || isRemoveAllPending,
  };
};
