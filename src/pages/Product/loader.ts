import { marketingProductLoader } from "@/features/marketing/providers/use-marketing-product-query";
import { productLoader } from "@/features/products/providers/product-query";
import type { LoaderFunctionArgs } from "@/lib/router";

export const productPageLoader = ({ params }: LoaderFunctionArgs) => {
  const productId = (params as { productId: string }).productId;
  return Promise.all([
    productLoader(productId),
    marketingProductLoader(productId).catch(() => null),
  ]);
};
