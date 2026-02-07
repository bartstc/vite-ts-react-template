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
  type AlertDialogProps,
} from "@chakra-ui/react";
import { useRef } from "react";

import { useProductAddedDialogStore } from "@/features/carts/components/AddToCartButton/useProductAddedDialogStore";
import { useTranslations } from "@/lib/i18n/useTransations";
import { useNavigate } from "@/lib/router";
import { routes } from "@/lib/router/routes";
import { useSecondaryTextColor } from "@/lib/theme/useSecondaryTextColor";

const ProductAddedDialog = () => {
  const secondaryColor = useSecondaryTextColor();
  const navigate = useNavigate();
  const t = useTranslations("features.carts.add-to-cart.dialog");

  const cancelRef = useRef<HTMLButtonElement>(null);

  const { isOpen, onClose, cartId } = useProductAddedDialogStore((state) => ({
    isOpen: state.isOpen,
    onClose: state.onClose,
    cartId: state.selectedItem,
  }));

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
              <Text fontSize="sm" color={secondaryColor}>
                {t("success-message")}
              </Text>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                onClose();
                void navigate({
                  path: routes.cart,
                  params: { cartId: cartId?.toString() },
                });
              }}
            >
              {t("go-to-cart")}
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                onClose();
                void navigate("/products");
              }}
              ml={3}
            >
              {t("continue-shopping")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export { ProductAddedDialog };
