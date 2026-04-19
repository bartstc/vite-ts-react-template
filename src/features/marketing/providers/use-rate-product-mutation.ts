import { useMutation, useQueryClient } from "@tanstack/react-query";

import { marketingQueryKeys } from "@/lib/api/marketing/marketing-query-keys";
import type { MarketingProductDto } from "@/lib/api/marketing/{product-id}/marketing-product-dto";
import {
  rateProductMutationOptions,
  type RateProductDto,
} from "@/lib/api/marketing/{product-id}/rate-product-mutation";

interface MutationContext {
  previous: MarketingProductDto | undefined;
  productId: string;
}

export const useRateProductMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    MarketingProductDto,
    Error,
    RateProductDto,
    MutationContext
  >({
    ...rateProductMutationOptions,
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

  const handler = (productId: string, rating: number) =>
    mutateAsync({ productId, rating });

  return [handler, isPending] as const;
};
