/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useRef } from "react";

import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useSecondaryTextColor } from "theme";

import { t } from "utils";

import { useClearCart } from "../../infrastructure";
import { useClearCartNotifications } from "./useClearCartNotifications";

interface IProps {
  cartId: string;
}

const ClearCartButton = ({ cartId }: IProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const secondaryColor = useSecondaryTextColor();

  const [clear, isLoading] = useClearCart(cartId);
  const [notifySuccess, notifyFailure] = useClearCartNotifications();

  return (
    <>
      <Button leftIcon={<DeleteIcon />} onClick={onOpen} isLoading={isLoading}>
        {t("Clear cart")}
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef as any}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("Clear cart")}
            </AlertDialogHeader>

            <AlertDialogBody>
              <VStack align="stretch">
                <Text>
                  {t("Are you sure? You can't undo this action afterwards.")}
                </Text>
                <Text fontSize="xs" color={secondaryColor}>
                  {t(
                    "(because this app uses a fake API, this delete request will be mocked and won't affect the cart)"
                  )}
                </Text>
              </VStack>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef as any} onClick={onClose}>
                {t("Cancel")}
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  try {
                    await clear();
                    notifySuccess();
                  } catch {
                    notifyFailure();
                  } finally {
                    onClose();
                  }
                }}
                isLoading={isLoading}
                ml={3}
              >
                {t("Confirm")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export { ClearCartButton };
