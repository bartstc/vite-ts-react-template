import { Button } from "@chakra-ui/react";

import { useAuthStore } from "@/features/auth/application/auth-store";
import { useTranslations } from "@/lib/i18n/use-transations";

import { useCurrentUserReview } from "../application/use-current-user-review";

import { ReviewFormDialog } from "./ReviewFormDialog";
import { useReviewFormDialogStore } from "./use-review-form-dialog-store";

interface IProps {
  productId: string;
  initialRating: number;
}

const WriteReviewButton = ({ productId, initialRating }: IProps) => {
  const t = useTranslations("features.marketing.reviews");

  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const currentUserReview = useCurrentUserReview(productId);
  const onOpen = useReviewFormDialogStore((state) => state.onOpen);

  if (!isAuthenticated) return null;

  const label = currentUserReview
    ? currentUserReview.title || currentUserReview.comment
      ? t("edit-review")
      : t("add-review-details")
    : t("write-review");

  return (
    <>
      <Button
        variant="plain"
        colorPalette="blue"
        size="sm"
        onClick={() => onOpen(productId)}
      >
        {label}
      </Button>
      <ReviewFormDialog productId={productId} initialRating={initialRating} />
    </>
  );
};

export { WriteReviewButton };
