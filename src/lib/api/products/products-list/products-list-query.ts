import { queryOptions } from "@tanstack/react-query";

import { buildUrl } from "@/lib/build-url";
import { httpService } from "@/lib/http";
import { queryClient } from "@/lib/query";
import type { Meta } from "@/types/meta";
import type { QueryParams } from "@/types/query-params";

import { productsQueryKeys } from "../products-query-keys";
import type { ProductDto } from "../{product-id}/product-dto";

const defaultParams = { limit: 10, sort: "asc" };

interface ICollection {
  products: ProductDto[];
  meta: Meta;
}

export const productsQuery = (params: QueryParams = defaultParams) =>
  queryOptions({
    queryKey: productsQueryKeys.list(params),
    queryFn: (): Promise<ICollection> =>
      httpService.get<ICollection>(buildUrl("products", params)),
  });

export const productsLoader = async (params: QueryParams = defaultParams) =>
  queryClient.ensureQueryData(productsQuery(params));
