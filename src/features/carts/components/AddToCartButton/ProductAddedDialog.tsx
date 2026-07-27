import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  VStack,
  Text,
} from "@chakra-ui/react";

import { useProductAddedDialogStore } from "@/features/carts/application/use-product-added-dialog-store";
import { useTranslations } from "@/lib/i18n/use-transations";
import { useNavigate } from "@/lib/router";
import { routes } from "@/lib/router/routes";
import { useSecondaryTextColor } from "@/lib/theme/use-secondary-text-color";

const ProductAddedDialog = () => {
  const secondaryColor = useSecondaryTextColor();
  const navigate = useNavigate();
  const t = useTranslations("features.carts.add-to-cart.dialog");

  const isOpen = useProductAddedDialogStore((state) => state.isOpen);
  const onClose = useProductAddedDialogStore((state) => state.onClose);
  const cartId = useProductAddedDialogStore((state) => state.selectedItem);

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
                <Text fontSize="sm" color={secondaryColor}>
                  {t("success-message")}
                </Text>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                onClick={() => {
                  onClose();
                  void navigate({
                    path: routes.cart,
                    params: { cartId: cartId ?? undefined },
                  });
                }}
              >
                {t("go-to-cart")}
              </Button>
              <Button
                colorPalette="blue"
                onClick={() => {
                  onClose();
                  void navigate("/products");
                }}
                ml={3}
              >
                {t("continue-shopping")}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export { ProductAddedDialog };
