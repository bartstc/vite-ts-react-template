import { Button, ButtonProps } from "@chakra-ui/react";

import { t } from "utils";

import { useAuthStore } from "modules/auth/application";
import { useAddToCart } from "modules/carts/infrastructure";

import { useProductAddedDialogStore } from "./ProductAddedDialog";
import { useAddToCartNotifications } from "./useAddToCartNotifications";

interface IProps {
  productId: number;
  colorScheme?: ButtonProps["colorScheme"];
}

const AddToCartButton = ({ productId, colorScheme = "gray" }: IProps) => {
  const cartId = useAuthStore((store) => store.user?.cartId);
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

  const [add, isLoading] = useAddToCart();
  const { notifyFailure, notifySuccess, notifyNotAuthenticated } =
    useAddToCartNotifications();
  const onOpen = useProductAddedDialogStore((store) => store.onOpen);

  return (
    <Button
      w="100%"
      colorScheme={colorScheme}
      isLoading={isLoading}
      onClick={async () => {
        if (!isAuthenticated) {
          return notifyNotAuthenticated();
        }

        try {
          add({ productId });
          notifySuccess();
          onOpen(cartId);
        } catch {
          notifyFailure();
        }
      }}
    >
      {t("Add to cart")}
    </Button>
  );
};

export { AddToCartButton };
