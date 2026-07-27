import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useTranslations } from "@/lib/i18n/use-transations";

import { useDeleteReview } from "../application/use-delete-review";

import { useConfirmDeleteReviewDialogStore } from "./use-confirm-delete-review-dialog-store";

interface IProps {
  productId: string;
}

const ConfirmDeleteReviewDialog = ({ productId }: IProps) => {
  const t = useTranslations("features.marketing.reviews.delete-dialog");
  const { deleteReview, isPending } = useDeleteReview(productId);

  const isOpen = useConfirmDeleteReviewDialogStore((state) => state.isOpen);
  const onClose = useConfirmDeleteReviewDialogStore((state) => state.onClose);
  const reviewId = useConfirmDeleteReviewDialogStore(
    (state) => state.selectedItem
  );

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
                  if (!reviewId) return;
                  void deleteReview(reviewId).then((success) => {
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

export { ConfirmDeleteReviewDialog };
