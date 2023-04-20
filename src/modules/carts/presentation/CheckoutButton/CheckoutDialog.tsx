import { useRef } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";

import { t } from "utils";

import { createModalStore } from "shared/Modal";

import { CheckoutForm } from "../CheckoutForm";

export const usePurchaseDialogStore = createModalStore();

const CheckoutDialog = () => {
  const cancelRef = useRef();

  const { isOpen, onClose } = usePurchaseDialogStore((state) => ({
    isOpen: state.isOpen,
    onClose: state.onClose,
  }));

  return (
    <AlertDialog
      isOpen={isOpen}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      leastDestructiveRef={cancelRef as any}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent pb={4}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {t("Checkout")}
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
