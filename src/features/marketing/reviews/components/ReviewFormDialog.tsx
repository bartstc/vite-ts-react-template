import { CloseButton, Dialog, Portal } from "@chakra-ui/react";

import { useTranslations } from "@/lib/i18n/use-transations";

import { useCurrentUserReview } from "../application/use-current-user-review";

import { ReviewForm, type ReviewFormValues } from "./ReviewForm";
import { useReviewFormDialogStore } from "./use-review-form-dialog-store";

interface IProps {
  productId: string;
  initialRating: number;
}

const ReviewFormDialog = ({ productId, initialRating }: IProps) => {
  const t = useTranslations("features.marketing.reviews.dialog");
  const currentUserReview = useCurrentUserReview(productId);

  const isOpen = useReviewFormDialogStore((state) => state.isOpen);
  const onClose = useReviewFormDialogStore((state) => state.onClose);

  const defaultValues: ReviewFormValues = currentUserReview
    ? {
        rating: currentUserReview.rating,
        title: currentUserReview.title,
        comment: currentUserReview.comment,
      }
    : {
        rating: initialRating,
        title: "",
        comment: "",
      };

  return (
    <Dialog.Root
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
              <Dialog.Title>
                {currentUserReview ? t("edit-title") : t("create-title")}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            <Dialog.Body>
              {isOpen && (
                <ReviewForm
                  productId={productId}
                  defaultValues={defaultValues}
                  onSuccess={onClose}
                />
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export { ReviewFormDialog };
