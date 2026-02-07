import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  type AlertDialogProps,
} from "@chakra-ui/react";
import { useRef } from "react";

import { usePurchaseDialogStore } from "@/features/carts/components/CheckoutButton/usePurchaseDialogStore";
import { useTranslations } from "@/lib/i18n/useTransations";

import { CheckoutForm } from "../CheckoutForm";

const CheckoutDialog = () => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("features.carts.checkout.dialog");

  const { isOpen, onClose } = usePurchaseDialogStore((state) => ({
    isOpen: state.isOpen,
    onClose: state.onClose,
  }));

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef as AlertDialogProps["leastDestructiveRef"]}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent pb={4}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {t("title")}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <CheckoutForm onSuccess={onClose} />
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export { CheckoutDialog };
