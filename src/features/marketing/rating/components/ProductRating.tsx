import { Button, HStack } from "@chakra-ui/react";

import { useAuthStore } from "@/features/auth/application/auth-store";
import { useMarketingProductQuery } from "@/features/marketing/providers/use-marketing-product-query";
import { withErrorBoundary } from "@/lib/components/ErrorBoundary/with-error-boundary";
import { useTranslations } from "@/lib/i18n/use-transations";

import { ProductRatingFallback } from "./ProductRatingFallback";
import { StarRating } from "./StarRating";

interface IProps {
  productId: string;
  onSeeReviews?: () => void;
  writeReviewSlot?: React.ReactNode;
  hasReview?: boolean;
}

const ProductRatingBase = ({
  productId,
  onSeeReviews,
  writeReviewSlot,
  hasReview,
}: IProps) => {
  const { data: marketingProduct } = useMarketingProductQuery(productId);
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const t = useTranslations("features.marketing.rating");

  const count = marketingProduct?.rating.count ?? 0;
  const rate = marketingProduct?.rating.rate ?? 0;

  return (
    <HStack gap={4}>
      <StarRating rating={rate} productId={productId} hasReview={hasReview} />
      <Button
        variant="plain"
        colorPalette="orange"
        disabled={count === 0}
        onClick={onSeeReviews}
      >
        {t("see-reviews", { number: count })}
      </Button>
      {isAuthenticated && writeReviewSlot}
    </HStack>
  );
};

const ProductRating = withErrorBoundary<IProps>(ProductRatingFallback)(
  ProductRatingBase
);

export { ProductRating };
