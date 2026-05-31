import { mutationOptions } from "@tanstack/react-query";

import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";
import { UnknownError } from "@/lib/types/unknown-error";

export interface DeleteReviewDto {
  productId: string;
  reviewId: string;
}

export const deleteReviewMutationOptions = mutationOptions({
  mutationFn: async ({
    productId,
    reviewId,
  }: DeleteReviewDto): Promise<void> => {
    try {
      await httpService.delete<void>(
        `marketing/products/${productId}/reviews/${reviewId}`
      );
    } catch (e) {
      Logger.error("An error occurred during deleting a review", e as Error);
      throw new UnknownError();
    }
  },
});
