/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useRef } from "react";

import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  VStack,
  Text,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import { useSecondaryTextColor } from "theme";

import { t } from "utils";

import { createModalStore } from "shared/Modal";
import { useNavigate } from "shared/Router";

export const useProductAddedDialogStore = createModalStore<number>();

const ProductAddedDialog = () => {
  const secondaryColor = useSecondaryTextColor();
  const navigate = useNavigate();

  const cancelRef = useRef();

  const { isOpen, onClose, cartId } = useProductAddedDialogStore((state) => ({
    isOpen: state.isOpen,
    onClose: state.onClose,
    cartId: state.selectedItem,
  }));

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef as any}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {t("New product in the cart")}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <VStack align="stretch">
              <Text>
                {t(
                  "Wonderful! You have already added a new product to your cart."
                )}
              </Text>
              <Text fontSize="xs" color={secondaryColor}>
                {t(
                  "(because this app uses a fake API, the request will be mocked and won't affect the app's data)"
                )}
              </Text>
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef as any} onClick={onClose}>
              {t("Continue shopping")}
            </Button>
            <Button
              colorScheme="orange"
              onClick={() => {
                onClose();
                navigate(`/cart/${cartId}`);
              }}
              ml={3}
            >
              {t("Go to cart")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export { ProductAddedDialog };
