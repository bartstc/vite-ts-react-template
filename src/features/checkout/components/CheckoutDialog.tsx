import { CloseButton, Dialog, Portal } from "@chakra-ui/react";

import { CheckoutActorProvider } from "@/features/checkout/application/CheckoutActorProvider";
import { CheckoutFlow } from "@/features/checkout/components/CheckoutFlow";
import { useCheckoutDialogStore } from "@/features/checkout/components/use-checkout-dialog-store";
import { useCartInvalidation } from "@/features/checkout/providers/use-cart-invalidation";
import { useTranslations } from "@/lib/i18n/use-transations";

interface Props {
  cartId: string;
}

// AIDEV-NOTE: owns the whole checkout flow — mounts CheckoutActorProvider (injecting the
// initiate/apply/confirm actors + cart-query invalidation as onConfirmed) and renders
// CheckoutFlow. cartId is supplied by the parent (the Cart page). See 003.
const CheckoutDialog = ({ cartId }: Props) => {
  const t = useTranslations("features.checkout.dialog");

  const { isOpen, onClose } = useCheckoutDialogStore((state) => ({
    isOpen: state.isOpen,
    onClose: state.onClose,
  }));

  const onConfirmed = useCartInvalidation(cartId);

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
              {isOpen && (
                <CheckoutActorProvider
                  cartId={cartId}
                  onConfirmed={onConfirmed}
                >
                  <CheckoutFlow onClose={onClose} />
                </CheckoutActorProvider>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export { CheckoutDialog };
