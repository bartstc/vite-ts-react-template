import { CloseButton, Dialog, Portal } from "@chakra-ui/react";

import { usePurchaseDialogStore } from "@/features/carts/components/CheckoutButton/use-purchase-dialog-store";
import { useTranslations } from "@/lib/i18n/use-transations";

import { CheckoutForm } from "../CheckoutForm";

const CheckoutDialog = () => {
  const t = useTranslations("features.carts.checkout.dialog");

  const { isOpen, onClose } = usePurchaseDialogStore((state) => ({
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
          <Dialog.Content pb={4}>
            <Dialog.Header fontSize="lg" fontWeight="bold">
              <Dialog.Title>{t("title")}</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            <Dialog.Body>
              <CheckoutForm onSuccess={onClose} />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export { CheckoutDialog };
