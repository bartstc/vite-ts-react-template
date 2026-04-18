import { Button, HStack } from "@chakra-ui/react";

import { useMarketingProductQuery } from "@/features/marketing/providers/use-marketing-product-query";
import { withErrorBoundary } from "@/lib/components/ErrorBoundary/with-error-boundary";
import { useTranslations } from "@/lib/i18n/use-transations";

import { ProductRatingFallback } from "./ProductRatingFallback";
import { StarRating } from "./StarRating";

interface IProps {
  productId: string;
}

const ProductRatingBase = ({ productId }: IProps) => {
  const { data: marketingProduct } = useMarketingProductQuery(productId);
  const t = useTranslations("features.marketing.rating");

  return (
    <HStack gap={4}>
      <StarRating
        rating={marketingProduct?.rating.rate ?? 0}
        productId={productId}
      />
      <Button variant="plain" colorPalette="orange">
        {t("see-reviews", { number: marketingProduct?.rating.count ?? 0 })}
      </Button>
    </HStack>
  );
};

const ProductRating = withErrorBoundary<IProps>(ProductRatingFallback)(
  ProductRatingBase
);

export { ProductRating };
