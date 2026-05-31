import { useMutation, useQueryClient } from "@tanstack/react-query";

import { marketingQueryKeys } from "@/lib/api/marketing/marketing-query-keys";
import { deleteReviewMutationOptions } from "@/lib/api/marketing/{product-id}/reviews/delete-review-mutation";

export const useDeleteReviewMutation = (productId: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    ...deleteReviewMutationOptions,
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

  const handler = (reviewId: string) => mutateAsync({ productId, reviewId });

  return [handler, isPending] as const;
};
