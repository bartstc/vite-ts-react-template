import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  VStack,
  Text,
} from "@chakra-ui/react";

import { useRemoveCartProduct } from "@/features/carts/application/use-remove-cart-product";
import { useTranslations } from "@/lib/i18n/use-transations";

import { useConfirmRemoveProductDialogStore } from "./use-confirm-remove-product-dialog-store";

const ConfirmRemoveProductDialog = () => {
  const { removeOneFromCart, removeAllFromCart, isPending } =
    useRemoveCartProduct();
  const t = useTranslations("features.carts.remove-product.dialog");

  const isOpen = useConfirmRemoveProductDialogStore((state) => state.isOpen);
  const selectedItem = useConfirmRemoveProductDialogStore(
    (state) => state.selectedItem
  );
  const onClose = useConfirmRemoveProductDialogStore((state) => state.onClose);

  const isDecrement = selectedItem?.mode === "decrement";

  const handleConfirm = () => {
    if (!selectedItem) return;
    const action = isDecrement
      ? removeOneFromCart(selectedItem.productId)
      : removeAllFromCart(selectedItem.productId, selectedItem.quantity);
    void action.then((success) => {
      if (success) onClose();
    });
  };

  return (
    <Dialog.Root
      role="alertdialog"
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header fontSize="lg" fontWeight="bold">
              <Dialog.Title>
                {isDecrement ? t("decrement.title") : t("remove-all.title")}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            <Dialog.Body>
              <VStack align="stretch">
                <Text>
                  {isDecrement
                    ? t("decrement.message")
                    : t("remove-all.message")}
                </Text>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button onClick={onClose}>{t("cancel")}</Button>
              <Button
                colorPalette="red"
                onClick={handleConfirm}
                ml={3}
                loading={isPending}
              >
                {isDecrement ? t("decrement.confirm") : t("remove-all.confirm")}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export { ConfirmRemoveProductDialog };
