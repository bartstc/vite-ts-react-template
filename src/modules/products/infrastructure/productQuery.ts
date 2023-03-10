import { UseQueryOptions } from "@tanstack/react-query";

import {
  createLoader,
  httpService,
  useQuery,
  ResourceNotFoundException,
} from "utils";
import { AjaxError } from "utils/http";

import { IProduct } from "../types";
import { IProductDto } from "./types";

export const getProductQueryKey = (productId: string) => ["product", productId];

export const getProductQuery = (productId: string) => ({
  queryKey: getProductQueryKey(productId),
  queryFn: (): Promise<IProduct> =>
    httpService
      .get<IProductDto>(`products/${productId}`)
      .catch((e: AjaxError) => {
        if (e.status === 404) {
          throw new ResourceNotFoundException();
        }

        throw e;
      }),
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
  createLoader(getProductQuery(productId));
