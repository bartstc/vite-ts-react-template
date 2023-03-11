import { productsLoader } from "modules/products/infrastructure";

export const homePageLoader = () => {
  return productsLoader();
};
