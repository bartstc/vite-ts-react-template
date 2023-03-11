import { productLoader } from "modules/products/infrastructure";

export const productPageLoader = (productId: string) => {
  return productLoader(productId);
};
