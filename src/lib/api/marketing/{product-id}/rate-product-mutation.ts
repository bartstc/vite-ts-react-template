import { mutationOptions } from "@tanstack/react-query";

import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";
import { UnknownError } from "@/lib/types/unknown-error";

import type { MarketingProductDto } from "./marketing-product-dto";

export interface RateProductDto {
  productId: string;
  rating: number;
}

export const rateProductMutationOptions = mutationOptions({
  mutationFn: async ({
    productId,
    rating,
  }: RateProductDto): Promise<MarketingProductDto> => {
    try {
      return await httpService.patch<MarketingProductDto, { rating: number }>(
        `marketing/products/${productId}/rate`,
        { rating }
      );
    } catch (e) {
      Logger.error("An error occurred during rating the product", e as Error);
      throw new UnknownError();
    }
  },
});
