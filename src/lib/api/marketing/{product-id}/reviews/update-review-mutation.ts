import { mutationOptions } from "@tanstack/react-query";

import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";
import { UnknownError } from "@/lib/types/unknown-error";

import type { ReviewDto } from "./review-dto";

export interface UpdateReviewPayload {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewDto {
  productId: string;
  reviewId: string;
  payload: UpdateReviewPayload;
}

export const updateReviewMutationOptions = mutationOptions({
  mutationFn: async ({
    productId,
    reviewId,
    payload,
  }: UpdateReviewDto): Promise<ReviewDto> => {
    try {
      return await httpService.put<ReviewDto, UpdateReviewPayload>(
        `marketing/products/${productId}/reviews/${reviewId}`,
        payload
      );
    } catch (e) {
      Logger.error("An error occurred during updating a review", e as Error);
      throw new UnknownError();
    }
  },
});
