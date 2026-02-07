import { productsLoader } from "@/features/products/providers/products-query";

export const productsPageLoader = () => {
  return productsLoader();
};
