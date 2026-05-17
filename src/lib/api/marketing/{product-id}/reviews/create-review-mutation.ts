import { mutationOptions } from "@tanstack/react-query";

import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";
import { UnknownError } from "@/lib/types/unknown-error";

import type { ReviewDto } from "./review-dto";

export interface CreateReviewPayload {
  rating: number;
  title?: string;
  comment?: string;
}

export interface CreateReviewDto {
  productId: string;
  payload: CreateReviewPayload;
}

export class ReviewAlreadyExistsError extends Error {
  constructor() {
    super("Review already exists");
    this.name = "ReviewAlreadyExistsError";
  }
}

export const createReviewMutationOptions = mutationOptions({
  mutationFn: async ({
    productId,
    payload,
  }: CreateReviewDto): Promise<ReviewDto> => {
    try {
      return await httpService.post<ReviewDto, CreateReviewPayload>(
        `marketing/products/${productId}/reviews`,
        payload
      );
    } catch (e) {
      Logger.error("An error occurred during creating a review", e as Error);
      if (
        httpService.isError(e) &&
        e.message === "Review already exists for this user and product"
      ) {
        throw new ReviewAlreadyExistsError();
      }
      throw new UnknownError();
    }
  },
});
