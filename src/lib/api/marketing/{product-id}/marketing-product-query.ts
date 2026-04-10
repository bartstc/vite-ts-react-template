import { queryOptions } from "@tanstack/react-query";

import { marketingQueryKeys } from "@/lib/api/marketing/marketing-query-keys";
import { httpService } from "@/lib/http";

import type { MarketingProductDto } from "./marketing-product-dto";

export const marketingProductQuery = (productId: string) =>
  queryOptions({
    queryKey: marketingQueryKeys.product(productId),
    queryFn: (): Promise<MarketingProductDto> =>
      httpService.get<MarketingProductDto>(`marketing/products/${productId}`),
  });
