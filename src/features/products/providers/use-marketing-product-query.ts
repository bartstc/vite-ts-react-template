import { marketingProductQuery } from "@/lib/api/marketing/{product-id}/marketing-product-query";
import { useQuery } from "@/lib/query";

export const useMarketingProductQuery = (productId: string) =>
  useQuery(marketingProductQuery(productId));
