import { useCurrentUserReview } from "@/features/marketing/reviews/application/use-current-user-review";
import {
  ReviewAlreadyExistsError,
  useCreateReviewMutation,
} from "@/features/marketing/reviews/providers/use-create-review-mutation";
import { useUpdateReviewMutation } from "@/features/marketing/reviews/providers/use-update-review-mutation";

import { useReviewFormNotifications } from "./use-review-form-notifications";

export interface SubmitReviewPayload {
  rating: number;
  title: string;
  comment: string;
}

const toApiPayload = (values: SubmitReviewPayload) => ({
  rating: values.rating,
  title: values.title.trim() || undefined,
  comment: values.comment.trim() || undefined,
});

export const useSubmitReview = (productId: string) => {
  const currentUserReview = useCurrentUserReview(productId);
  const [createReview, isCreating] = useCreateReviewMutation(productId);
  const [updateReview, isUpdating] = useUpdateReviewMutation(productId);
  const { notifySuccess, notifyConflict, notifyFailure } =
    useReviewFormNotifications();

  const submitReview = async (values: SubmitReviewPayload) => {
    try {
      if (currentUserReview) {
        await updateReview(currentUserReview.id, toApiPayload(values));
      } else {
        await createReview(toApiPayload(values));
      }
      notifySuccess();
      return true;
    } catch (e) {
      if (e instanceof ReviewAlreadyExistsError) {
        notifyConflict();
        return false;
      }
      notifyFailure();
      return false;
    }
  };

  return { submitReview, isPending: isCreating || isUpdating };
};
