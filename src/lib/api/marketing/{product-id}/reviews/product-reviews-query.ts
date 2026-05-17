import { queryOptions } from "@tanstack/react-query";

import { marketingQueryKeys } from "@/lib/api/marketing/marketing-query-keys";
import { httpService } from "@/lib/http";

import type { ListReviewsDto } from "./review-dto";

export const productReviewsQuery = (productId: string) =>
  queryOptions({
    queryKey: marketingQueryKeys.reviews(productId),
    queryFn: (): Promise<ListReviewsDto> =>
      httpService.get<ListReviewsDto>(
        `marketing/products/${productId}/reviews?limit=10&sort=desc`
      ),
  });
