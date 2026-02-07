import { productLoader } from "@/features/products/providers/product-query";
import type { LoaderFunctionArgs } from "@/lib/router";

export const productPageLoader = ({ params }: LoaderFunctionArgs) => {
  return productLoader((params as { productId: string }).productId);
};
