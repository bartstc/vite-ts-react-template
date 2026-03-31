import { keepPreviousData } from "@tanstack/react-query";

import { cartProductsQuery } from "@/lib/api/carts/{cart-id}/cart-products-query";
import { useQuery } from "@/lib/query";

export { cartProductsLoader } from "@/lib/api/carts/{cart-id}/cart-products-query";
export { cartProductsQuery };

export const useCartProductsQuery = (cartId: string) =>
  useQuery({ ...cartProductsQuery(cartId), placeholderData: keepPreviousData });
