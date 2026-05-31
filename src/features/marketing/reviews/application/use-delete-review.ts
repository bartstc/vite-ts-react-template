import { useDeleteReviewMutation } from "@/features/marketing/reviews/providers/use-delete-review-mutation";

import { useDeleteReviewNotifications } from "./use-delete-review-notifications";

export const useDeleteReview = (productId: string) => {
  const [deleteReviewMutation, isPending] = useDeleteReviewMutation(productId);
  const { notifySuccess, notifyFailure } = useDeleteReviewNotifications();

  const deleteReview = async (reviewId: string) => {
    try {
      await deleteReviewMutation(reviewId);
      notifySuccess();
      return true;
    } catch {
      notifyFailure();
      return false;
    }
  };

  return { deleteReview, isPending };
};
