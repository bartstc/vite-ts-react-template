import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { httpService } from "utils/http";

import { IProduct } from "../types";
import { IProductDto } from "./types";

export const getProductQueryKey = (productId: string) => ["product", productId];

export const getProductQuery = async (productId: string): Promise<IProduct> => {
  return await httpService.get<IProductDto>(`products/${productId}`);
};

export const useProductQuery = (
  productId: string,
  options?: UseQueryOptions<IProduct>
) => {
  return useQuery({
    queryKey: getProductQueryKey(productId),
    queryFn: () => getProductQuery(productId),
    ...options,
  });
};
