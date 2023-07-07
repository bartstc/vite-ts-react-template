import { UseQueryOptions } from "@tanstack/react-query";

import { useQuery, httpService, queryClient } from "utils";

import { getProductQuery } from "modules/products/infrastructure";

import { ICartProduct } from "../types";
import { ICartDto } from "./types";

interface IResponse {
  date: string;
  products: ICartProduct[];
}

export const getCartProductsQueryKey = (cartId: string) => [
  "carts",
  "products",
  cartId,
];

const getCartProductsQuery = (cartId: string) => ({
  queryKey: getCartProductsQueryKey(cartId),
  queryFn: async (): Promise<IResponse> => {
    const cart = await httpService.get<ICartDto>(`carts/${cartId}`);

    const productPromises = cart.products.map((product) =>
      getProductQuery(product.productId.toString()).queryFn()
    );

    const products = await Promise.all(productPromises);

    return {
      date: cart.date,
      products: products.map((product) => ({
        ...product,
        quantity:
          cart.products.find(
            (cartProduct) => cartProduct.productId === product.id
          )?.quantity ?? 0,
      })),
    };
  },
});

export const useCartProductsQuery = (
  cartId: string,
  options?: UseQueryOptions<IResponse>
) => {
  return useQuery({
    ...getCartProductsQuery(cartId),
    ...options,
  });
};

export const cartProductsLoader = async (cartId: string) =>
  queryClient.ensureQueryData(getCartProductsQuery(cartId));
