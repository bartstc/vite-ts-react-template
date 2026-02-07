import { productsLoader } from "@/features/products/providers/products-query";

export const homePageLoader = () => {
  return productsLoader();
};
