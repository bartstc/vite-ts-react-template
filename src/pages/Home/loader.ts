import { productsLoader } from "@/features/products/providers/productsQuery";

export const homePageLoader = () => {
  return productsLoader();
};
