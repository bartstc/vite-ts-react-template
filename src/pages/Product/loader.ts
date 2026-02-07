import { productLoader } from "@/features/products/providers/productQuery";
import type { LoaderFunctionArgs } from "@/lib/router";

export const productPageLoader = ({ params }: LoaderFunctionArgs) => {
  return productLoader((params as { productId: string }).productId);
};
