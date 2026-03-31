import { queryOptions } from "@tanstack/react-query";

import { httpService } from "@/lib/http";
import { queryClient } from "@/lib/query";

import { cartQueryKeys } from "../cart-query-keys";

import type { CartDto } from "./cart-dto";

export const cartQuery = (cartId: string) =>
  queryOptions({
    queryKey: cartQueryKeys.detail(cartId),
    queryFn: (): Promise<CartDto> =>
      httpService.get<CartDto>(`carts/${cartId}`),
  });

export const cartLoader = async (cartId: string) =>
  queryClient.ensureQueryData(cartQuery(cartId));
