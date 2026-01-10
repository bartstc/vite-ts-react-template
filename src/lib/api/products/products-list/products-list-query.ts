import type { UseQueryOptions } from "@tanstack/react-query";

import { buildUrl } from "@/lib/buildUrl";
import { httpService } from "@/lib/http";
import { queryClient, useQuery } from "@/lib/query";
import type { IMeta } from "@/types/IMeta";
import type { IQueryParams } from "@/types/IQueryParams";

import { productsQueryKeys } from "../products-query-keys";
import type { ProductDto } from "../{product-id}/product-dto";

const defaultParams = { limit: 10, sort: "asc" };

interface ICollection {
  products: ProductDto[];
  meta: IMeta;
}

const getProductsQuery = (params: IQueryParams = defaultParams) => ({
  queryKey: productsQueryKeys.list(params),
  queryFn: (): Promise<ICollection> =>
    httpService.get<ProductDto[]>(buildUrl("products", params)).then((res) => ({
      products: res,
      meta: {
        ...params,
        total: 20,
      },
    })),
});

export const useProductsQuery = (
  params: IQueryParams = defaultParams,
  options?: Omit<UseQueryOptions<ICollection>, "queryKey" | "queryFn">
) => {
  return useQuery({
    ...getProductsQuery(params),
    ...options,
  });
};

export const productsLoader = async (params: IQueryParams = defaultParams) =>
  queryClient.ensureQueryData(getProductsQuery(params));
