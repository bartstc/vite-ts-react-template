import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  VStack,
  Text,
} from "@chakra-ui/react";

import { useClearCart } from "@/features/carts/application/use-clear-cart";
import { useConfirmClearCartDialogStore } from "@/features/carts/components/ClearCartButton/use-confirm-clear-cart-dialog-store";
import { useTranslations } from "@/lib/i18n/use-transations";

const ConfirmClearCartDialog = () => {
  const { clearCart, isPending } = useClearCart();
  const t = useTranslations("features.carts.clear-cart.dialog");

  const { isOpen, onClose } = useConfirmClearCartDialogStore((state) => ({
    isOpen: state.isOpen,
    onClose: state.onClose,
  }));

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
              <Dialog.Title>{t("title")}</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            <Dialog.Body>
              <VStack align="stretch">
                <Text>{t("message")}</Text>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button onClick={onClose}>{t("cancel")}</Button>
              <Button
                colorPalette="red"
                onClick={() => {
                  void clearCart().then((success) => {
                    if (success) onClose();
                  });
                }}
                ml={3}
                loading={isPending}
              >
                {t("confirm")}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export { ConfirmClearCartDialog };
