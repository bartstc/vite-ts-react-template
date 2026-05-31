import { Box, Heading, VStack } from "@chakra-ui/react";

import { useProductReviewsQuery } from "@/features/marketing/reviews/providers/use-product-reviews-query";
import { withErrorBoundary } from "@/lib/components/ErrorBoundary/with-error-boundary";
import { useTranslations } from "@/lib/i18n/use-transations";

import { ConfirmDeleteReviewDialog } from "./ConfirmDeleteReviewDialog";
import { ReviewListEmpty } from "./ReviewListEmpty";
import { ReviewListFallback } from "./ReviewListFallback";
import { ReviewListItem } from "./ReviewListItem";
import { REVIEWS_ANCHOR_ID } from "./reviews-anchor";

interface IProps {
  productId: string;
}

const ReviewListBase = ({ productId }: IProps) => {
  const { data } = useProductReviewsQuery(productId);
  const t = useTranslations("features.marketing.reviews.list");
  const reviews = data?.reviews ?? [];

  return (
    <Box id={REVIEWS_ANCHOR_ID} as="section" w="100%">
      <Heading as="h3" size="md" mb={4}>
        {t("title")}
      </Heading>
      {reviews.length === 0 ? (
        <ReviewListEmpty />
      ) : (
        <VStack as="ul" align="stretch" gap={0} pl={0}>
          {reviews.map((review) => (
            <ReviewListItem key={review.id} review={review} />
          ))}
        </VStack>
      )}
      <ConfirmDeleteReviewDialog productId={productId} />
    </Box>
  );
};

const ReviewList =
  withErrorBoundary<IProps>(ReviewListFallback)(ReviewListBase);

export { ReviewList };
