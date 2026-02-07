import type { QueryParams } from "@/types/query-params";

export const productsQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productsQueryKeys.all, "list"] as const,
  list: (params: QueryParams) =>
    [...productsQueryKeys.lists(), params] as const,
  details: () => [...productsQueryKeys.all, "detail"] as const,
  detail: (productId: string) =>
    [...productsQueryKeys.details(), productId] as const,
};
