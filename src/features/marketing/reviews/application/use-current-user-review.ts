import { useAuthStore } from "@/features/auth/application/auth-store";
import { useProductReviewsQuery } from "@/features/marketing/reviews/providers/use-product-reviews-query";

export const useCurrentUserReview = (productId: string) => {
  const userId = useAuthStore((store) => store.user?.id);
  const { data } = useProductReviewsQuery(productId);

  if (userId === undefined) return undefined;

  return data?.reviews.find((review) => review.userId === userId);
};
