import { Button, type ButtonProps } from "@chakra-ui/react";

import { useAuthStore } from "@/features/auth/application/auth-store";
import { useAddToCart } from "@/features/carts/application/use-add-to-cart";
import { useProductAddedDialogStore } from "@/features/carts/application/use-product-added-dialog-store";
import { useTranslations } from "@/lib/i18n/use-transations";

interface IProps {
  productId: string;
  colorPalette?: ButtonProps["colorPalette"];
}

const AddToCartButton = ({ productId, colorPalette = "gray" }: IProps) => {
  const t = useTranslations("features.carts.add-to-cart");
  const { onAddToCart, isPending } = useAddToCartButton(productId);

  return (
    <Button
      w="100%"
      colorPalette={colorPalette}
      loading={isPending}
      onClick={() => {
        void onAddToCart();
      }}
    >
      {t("button")}
    </Button>
  );
};

export { AddToCartButton };

const useAddToCartButton = (productId: string) => {
  const { addToCart, isPending } = useAddToCart();
  const cartId = useAuthStore((store) => store.user?.cartId);
  const onOpen = useProductAddedDialogStore((store) => store.onOpen);

  const onAddToCart = async () => {
    const success = await addToCart(productId);
    if (success) onOpen(cartId);
  };

  return { onAddToCart, isPending };
};
