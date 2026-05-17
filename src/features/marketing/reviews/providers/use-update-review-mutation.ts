import { useMutation, useQueryClient } from "@tanstack/react-query";

import { marketingQueryKeys } from "@/lib/api/marketing/marketing-query-keys";
import {
  updateReviewMutationOptions,
  type UpdateReviewPayload,
} from "@/lib/api/marketing/{product-id}/reviews/update-review-mutation";

export const useUpdateReviewMutation = (productId: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    ...updateReviewMutationOptions,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: marketingQueryKeys.product(productId),
        }),
        queryClient.invalidateQueries({
          queryKey: marketingQueryKeys.reviews(productId),
        }),
      ]);
    },
  });

  const handler = (reviewId: string, payload: UpdateReviewPayload) =>
    mutateAsync({ productId, reviewId, payload });

  return [handler, isPending] as const;
};
