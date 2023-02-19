import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { httpService } from "utils/http";

import { getProductQuery } from "modules/products/infrastructure";

import { ICartProduct } from "../types";
import { ICartDto } from "./types";

export const getCartProductsQueryKey = (cartId: number) => [
  "carts",
  "products",
  cartId,
];

export const getCartProductsQuery = async (
  cartId: number
): Promise<ICartProduct[]> => {
  const cart = await httpService.get<ICartDto>(`carts/${cartId}`);

  const productPromises = cart.products.map((product) =>
    getProductQuery(product.productId.toString())
  );

  const products = await Promise.all(productPromises);

  return products.map((product) => ({
    ...product,
    quantity:
      cart.products.find((cartProduct) => cartProduct.productId === product.id)
        ?.quantity ?? 0,
  }));
};

export const useCartProductsQuery = (
  cartId: number,
  options?: UseQueryOptions<ICartProduct[]>
) => {
  return useQuery({
    queryKey: getCartProductsQueryKey(cartId),
    queryFn: () => getCartProductsQuery(cartId),
    ...options,
  });
};
