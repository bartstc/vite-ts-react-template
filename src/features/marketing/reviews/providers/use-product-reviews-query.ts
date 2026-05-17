import { productReviewsQuery } from "@/lib/api/marketing/{product-id}/reviews/product-reviews-query";
import { useQuery } from "@/lib/query";

export const useProductReviewsQuery = (productId: string) =>
  useQuery({ ...productReviewsQuery(productId), throwOnError: true });
