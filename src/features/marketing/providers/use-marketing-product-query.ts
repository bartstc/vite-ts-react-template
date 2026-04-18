import {
  marketingProductLoader,
  marketingProductQuery,
} from "@/lib/api/marketing/{product-id}/marketing-product-query";
import { useQuery } from "@/lib/query";

export { marketingProductLoader };

export const useMarketingProductQuery = (productId: string) =>
  useQuery({ ...marketingProductQuery(productId), throwOnError: true });
