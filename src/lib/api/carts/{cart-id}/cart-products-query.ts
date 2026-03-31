import { queryOptions } from "@tanstack/react-query";

import type { ProductDto } from "@/lib/api/products/{product-id}/product-dto";
import { httpService } from "@/lib/http";
import { queryClient } from "@/lib/query";

import { cartQueryKeys } from "../cart-query-keys";

import type { CartDto } from "./cart-dto";
import type { CartProductDto } from "./cart-product-dto";

interface IResponse {
  date: string;
  products: CartProductDto[];
}

const cartProductsQuery = (cartId: string) =>
  queryOptions({
    queryKey: cartQueryKeys.products(cartId),
    queryFn: async (): Promise<IResponse> => {
      const cart = await httpService.get<CartDto>(`carts/${cartId}`);

      const products = await Promise.all(
        cart.products.map((product) =>
          httpService.get<ProductDto>(`products/${product.productId}`)
        )
      );

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

export const cartProductsLoader = async (cartId: string) =>
  queryClient.ensureQueryData(cartProductsQuery(cartId));

export { cartProductsQuery };
