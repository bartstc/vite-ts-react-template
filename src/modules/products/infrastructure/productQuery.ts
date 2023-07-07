import { UseQueryOptions } from "@tanstack/react-query";

import { httpService, queryClient, useQuery } from "utils";

import { IProduct } from "../types";
import { IProductDto } from "./types";

export const getProductQueryKey = (productId: string) => ["product", productId];

export const getProductQuery = (productId: string) => ({
  queryKey: getProductQueryKey(productId),
  queryFn: (): Promise<IProduct> =>
    httpService.get<IProductDto>(`products/${productId}`),
});

export const useProductQuery = (
  productId: string,
  options?: UseQueryOptions<IProduct>
) => {
  return useQuery({
    ...getProductQuery(productId),
    ...options,
  });
};

export const productLoader = async (productId: string) =>
  queryClient.ensureQueryData(getProductQuery(productId));
