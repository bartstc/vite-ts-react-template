import { useMutation, useQueryClient } from "@tanstack/react-query";

import { marketingQueryKeys } from "@/lib/api/marketing/marketing-query-keys";
import {
  createReviewMutationOptions,
  type CreateReviewPayload,
} from "@/lib/api/marketing/{product-id}/reviews/create-review-mutation";

export { ReviewAlreadyExistsError } from "@/lib/api/marketing/{product-id}/reviews/create-review-mutation";

export const useCreateReviewMutation = (productId: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    ...createReviewMutationOptions,
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

  const handler = (payload: CreateReviewPayload) =>
    mutateAsync({ productId, payload });

  return [handler, isPending] as const;
};
