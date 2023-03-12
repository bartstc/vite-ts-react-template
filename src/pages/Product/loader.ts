import { LoaderFunctionArgs } from "shared/Router";

import { productLoader } from "modules/products/infrastructure";

export const productPageLoader = ({ params }: LoaderFunctionArgs) => {
  return productLoader((params as { productId: string }).productId);
};
