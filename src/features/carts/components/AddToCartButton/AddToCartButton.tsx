import { Button, type ButtonProps } from "@chakra-ui/react";

import { useAddToCart } from "@/features/carts/application/use-add-to-cart";
import { useTranslations } from "@/lib/i18n/use-transations";

interface IProps {
  productId: number;
  colorPalette?: ButtonProps["colorPalette"];
}

const AddToCartButton = ({ productId, colorPalette = "gray" }: IProps) => {
  const t = useTranslations("features.carts.add-to-cart");
  const { addToCart, isPending } = useAddToCart();

  return (
    <Button
      w="100%"
      colorPalette={colorPalette}
      loading={isPending}
      onClick={() => addToCart(productId)}
    >
      {t("button")}
    </Button>
  );
};

export { AddToCartButton };
