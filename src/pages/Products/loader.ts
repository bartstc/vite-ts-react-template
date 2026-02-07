import { productsLoader } from "@/features/products/providers/productsQuery";

export const productsPageLoader = () => {
  return productsLoader();
};
