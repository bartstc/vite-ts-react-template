import { productsQuery } from "@/lib/api/products/products-list/products-list-query";
import { useQuery } from "@/lib/query";
import type { QueryParams } from "@/types/query-params";

export { productsLoader } from "@/lib/api/products/products-list/products-list-query";
export { productsQuery };

export const useProductsQuery = (params?: QueryParams) =>
  useQuery(productsQuery(params));
