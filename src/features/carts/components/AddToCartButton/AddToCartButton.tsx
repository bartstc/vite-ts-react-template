import { Button, type ButtonProps } from "@chakra-ui/react";

import { useAuthStore } from "@/features/auth/application/authStore";
import { useProductAddedDialogStore } from "@/features/carts/components/AddToCartButton/useProductAddedDialogStore";
import { useAddToCart } from "@/features/carts/providers/useAddToCart";
import { useTranslations } from "@/lib/i18n/useTransations";

import { useAddToCartNotifications } from "./useAddToCartNotifications";

interface IProps {
  productId: number;
  colorScheme?: ButtonProps["colorScheme"];
}

const AddToCartButton = ({ productId, colorScheme = "gray" }: IProps) => {
  const cartId = useAuthStore((store) => store.user?.cartId);
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const t = useTranslations("features.carts.add-to-cart");

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
          await add({ productId });
          notifySuccess();
          onOpen(cartId);
        } catch {
          notifyFailure();
        }
      }}
    >
      {t("button")}
    </Button>
  );
};

export { AddToCartButton };
