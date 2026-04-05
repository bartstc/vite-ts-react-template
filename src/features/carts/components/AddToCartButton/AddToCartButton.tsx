import { Button, type ButtonProps } from "@chakra-ui/react";

import { useAuthStore } from "@/features/auth/application/auth-store";
import { useProductAddedDialogStore } from "@/features/carts/components/AddToCartButton/use-product-added-dialog-store";
import {
  useAddToCart,
  UnknownProductError,
  ProductNotAvailableError,
} from "@/features/carts/providers/use-add-to-cart";
import { useTranslations } from "@/lib/i18n/use-transations";

import { useAddToCartNotifications } from "./use-add-to-cart-notifications";

interface IProps {
  productId: number;
  colorPalette?: ButtonProps["colorPalette"];
}

const AddToCartButton = ({ productId, colorPalette = "gray" }: IProps) => {
  const cartId = useAuthStore((store) => store.user?.cartId);
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const t = useTranslations("features.carts.add-to-cart");

  const [add, isLoading] = useAddToCart();
  const {
    notifyFailure,
    notifySuccess,
    notifyNotAuthenticated,
    notifyUnknownProduct,
    notifyProductNotAvailable,
  } = useAddToCartNotifications();
  const onOpen = useProductAddedDialogStore((store) => store.onOpen);

  const onAdd = async () => {
    if (!isAuthenticated) {
      return notifyNotAuthenticated();
    }

    try {
      await add({ productId, quantity: 1 });
      notifySuccess();
      onOpen(cartId);
    } catch (e) {
      if (e instanceof UnknownProductError) {
        notifyUnknownProduct();
        return;
      }

      if (e instanceof ProductNotAvailableError) {
        notifyProductNotAvailable();
        return;
      }

      notifyFailure();
    }
  };

  return (
    <Button
      w="100%"
      colorPalette={colorPalette}
      loading={isLoading}
      onClick={onAdd}
    >
      {t("button")}
    </Button>
  );
};

export { AddToCartButton };
