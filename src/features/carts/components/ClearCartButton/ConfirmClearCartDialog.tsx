import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  VStack,
  Text,
  type AlertDialogProps,
} from "@chakra-ui/react";
import { useRef } from "react";

import { useConfirmClearCartDialogStore } from "@/features/carts/components/ClearCartButton/useConfirmClearCartDialogStore";
import { useClearCart } from "@/features/carts/providers/useClearCart";
import { useTranslations } from "@/lib/i18n/useTransations";

import { useClearCartNotifications } from "./useClearCartNotifications";

const ConfirmClearCartDialog = () => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [clear, isLoading] = useClearCart();
  const t = useTranslations("features.carts.clear-cart.dialog");

  const { isOpen, onClose } = useConfirmClearCartDialogStore((state) => ({
    isOpen: state.isOpen,
    onClose: state.onClose,
  }));

  const [notifySuccess, notifyFailure] = useClearCartNotifications();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef as AlertDialogProps["leastDestructiveRef"]}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {t("title")}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <VStack align="stretch">
              <Text>{t("message")}</Text>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                clear()
                  .then(() => {
                    notifySuccess();
                    onClose();
                  })
                  .catch(() => notifyFailure());
              }}
              ml={3}
              isLoading={isLoading}
            >
              {t("confirm")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export { ConfirmClearCartDialog };
