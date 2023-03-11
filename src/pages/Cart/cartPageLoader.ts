import { cartProductsLoader } from "modules/carts/infrastructure";

export const cartPageLoader = (cartId: string) => {
  return cartProductsLoader(cartId);
};
