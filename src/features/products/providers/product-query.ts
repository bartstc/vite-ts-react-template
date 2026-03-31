import { productQuery } from "@/lib/api/products/{product-id}/product-query";
import { useQuery } from "@/lib/query";

export { productLoader } from "@/lib/api/products/{product-id}/product-query";
export { productQuery };

export const useProductQuery = (productId: string) =>
  useQuery(productQuery(productId));
