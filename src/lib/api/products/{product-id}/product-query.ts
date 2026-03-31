import { queryOptions } from "@tanstack/react-query";

import { httpService } from "@/lib/http";
import { queryClient } from "@/lib/query";

import { productsQueryKeys } from "../products-query-keys";

import type { ProductDto } from "./product-dto";

export const productQuery = (productId: string) =>
  queryOptions({
    queryKey: productsQueryKeys.detail(productId),
    queryFn: (): Promise<ProductDto> =>
      httpService.get<ProductDto>(`products/${productId}`),
  });

export const productLoader = async (productId: string) =>
  queryClient.ensureQueryData(productQuery(productId));
