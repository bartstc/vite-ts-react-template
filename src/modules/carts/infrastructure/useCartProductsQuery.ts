import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { createLoader } from "utils";
import { httpService } from "utils/http";

import { getProductQuery } from "modules/products/infrastructure";

import { ICartProduct } from "../types";
import { ICartDto } from "./types";

export const getCartProductsQueryKey = (cartId: string) => [
  "carts",
  "products",
  cartId,
];

const getCartProductsQuery = (cartId: string) => ({
  queryKey: getCartProductsQueryKey(cartId),
  queryFn: async (): Promise<ICartProduct[]> => {
    const cart = await httpService.get<ICartDto>(`carts/${cartId}`);

    const productPromises = cart.products.map((product) =>
      getProductQuery(product.productId.toString()).queryFn()
    );

    const products = await Promise.all(productPromises);

    return products.map((product) => ({
      ...product,
      quantity:
        cart.products.find(
          (cartProduct) => cartProduct.productId === product.id
        )?.quantity ?? 0,
    }));
  },
});

export const useCartProductsQuery = (
  cartId: string,
  options?: UseQueryOptions<ICartProduct[]>
) => {
  return useQuery({
    ...getCartProductsQuery(cartId),
    ...options,
  });
};

export const cartProductsLoader = async (cartId: string) =>
  createLoader(getCartProductsQuery(cartId));
