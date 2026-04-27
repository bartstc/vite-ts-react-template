import { HStack, IconButton, Text } from "@chakra-ui/react";
import { Minus, Plus } from "lucide-react";

import { useAddToCart } from "@/features/carts/application/use-add-to-cart";
import { useRemoveCartProduct } from "@/features/carts/application/use-remove-cart-product";
import { useTranslations } from "@/lib/i18n/use-transations";

import { useConfirmRemoveProductDialogStore } from "./use-confirm-remove-product-dialog-store";

interface Props {
  productId: string;
  quantity: number;
}

const QuantityControls = ({ productId, quantity }: Props) => {
  const { onDecrement, onIncrement, isDisabled } = useQuantityControls(
    productId,
    quantity
  );
  const t = useTranslations("features.carts.remove-product.quantity-controls");

  return (
    <HStack gap={1}>
      <IconButton
        aria-label={t("decrement")}
        size="xs"
        variant="outline"
        onClick={() => {
          void onDecrement();
        }}
        disabled={isDisabled}
      >
        <Minus />
      </IconButton>
      <Text fontSize="sm" minW="6" textAlign="center">
        {quantity}
      </Text>
      <IconButton
        aria-label={t("increment")}
        size="xs"
        variant="outline"
        onClick={() => {
          void onIncrement();
        }}
        disabled={isDisabled}
      >
        <Plus />
      </IconButton>
    </HStack>
  );
};

export { QuantityControls };

const useQuantityControls = (productId: string, quantity: number) => {
  const { removeOneFromCart, isPending: isRemovePending } =
    useRemoveCartProduct();
  const { addToCart, isPending: isAddPending } = useAddToCart();
  const openDialog = useConfirmRemoveProductDialogStore((s) => s.onOpen);

  const onDecrement = async () => {
    if (quantity > 1) {
      await removeOneFromCart(productId);
    } else {
      openDialog({ productId, quantity, mode: "decrement" });
    }
  };

  const onIncrement = async () => {
    await addToCart(productId);
  };

  return {
    onDecrement,
    onIncrement,
    isDisabled: isRemovePending || isAddPending,
  };
};
