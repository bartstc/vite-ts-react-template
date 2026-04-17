import { useMutation, useQueryClient } from "@tanstack/react-query";

import { marketingQueryKeys } from "@/lib/api/marketing/marketing-query-keys";
import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";
import { UnknownError } from "@/lib/types/unknown-error";

import type { MarketingProductDto } from "./marketing-product-dto";

interface RateProductDto {
  productId: string;
  rating: number;
}

interface MutationContext {
  previous: MarketingProductDto | undefined;
  productId: string;
}

export const useRateProductMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    MarketingProductDto,
    unknown,
    RateProductDto,
    MutationContext
  >({
    mutationFn: ({ productId, rating }) =>
      httpService.patch<MarketingProductDto, { rating: number }>(
        `marketing/products/${productId}/rate`,
        { rating }
      ),
    onMutate: async ({ productId, rating }) => {
      const queryKey = marketingQueryKeys.product(productId);
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<MarketingProductDto>(queryKey);

      if (previous) {
        const { rate: oldRate, count: oldCount } = previous.rating;
        const newCount = oldCount + 1;
        const newRate =
          Math.round(((oldRate * oldCount + rating) / newCount) * 100) / 100;

        queryClient.setQueryData<MarketingProductDto>(queryKey, {
          ...previous,
          rating: { rate: newRate, count: newCount },
        });
      }

      return { previous, productId };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          marketingQueryKeys.product(context.productId),
          context.previous
        );
      }
    },
  });

  const handler = async (productId: string, rating: number) => {
    try {
      return await mutateAsync({ productId, rating });
    } catch (e) {
      Logger.error("An error occurred during rating the product", e as Error);
      throw new UnknownError();
    }
  };

  return [handler, isPending] as const;
};
