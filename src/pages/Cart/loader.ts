import { cartProductsLoader } from "@/features/carts/providers/use-cart-products-query";
import type { LoaderFunctionArgs } from "@/lib/router";

export const cartPageLoader = ({ params }: LoaderFunctionArgs) => {
  return cartProductsLoader((params as { cartId: string }).cartId);
};
