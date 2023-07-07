import { UseQueryOptions } from "@tanstack/react-query";

import { IQueryParams, IMeta } from "types";

import { buildUrl, httpService, queryClient, useQuery } from "utils";

import { IProduct } from "../types";
import { IProductDto } from "./types";

const defaultParams = { limit: 10, sort: "asc" };

interface ICollection {
  products: IProduct[];
  meta: IMeta;
}

export const getProductsQueryKey = (params: IQueryParams = defaultParams) => [
  "products",
  params,
];

const getProductsQuery = (params: IQueryParams = defaultParams) => ({
  queryKey: getProductsQueryKey(params),
  queryFn: (): Promise<ICollection> =>
    httpService
      .get<IProductDto[]>(buildUrl("products", params))
      .then((res) => ({
        products: res,
        meta: {
          ...params,
          total: 20,
        },
      })),
});

export const useProductsQuery = (
  params: IQueryParams = defaultParams,
  options?: UseQueryOptions<ICollection>
) => {
  return useQuery({
    ...getProductsQuery(params),
    ...options,
  });
};

export const productsLoader = async (params: IQueryParams = defaultParams) =>
  queryClient.ensureQueryData(getProductsQuery(params));
