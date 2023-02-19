import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { httpService } from "utils/http";

import { ICart } from "../types";
import { ICartDto } from "./types";

export const getCartQueryKey = (cartId: number) => ["carts", cartId];

export const getCartQuery = async (cartId: number): Promise<ICart> => {
  return await httpService.get<ICartDto>(`carts/${cartId}`);
};

export const useCartQuery = (
  cartId: number,
  options?: UseQueryOptions<ICart>
) => {
  return useQuery({
    queryKey: getCartQueryKey(cartId),
    queryFn: () => getCartQuery(cartId),
    ...options,
  });
};
