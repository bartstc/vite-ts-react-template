import { Button } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";

import { useMarketingProductQuery } from "@/features/marketing/providers/use-marketing-product-query";
import { ProductRating } from "@/features/marketing/rating/components/ProductRating";
import { useCurrentUserReview } from "@/features/marketing/reviews/application/use-current-user-review";
import { ReviewList } from "@/features/marketing/reviews/components/ReviewList";
import { REVIEWS_ANCHOR_ID } from "@/features/marketing/reviews/components/reviews-anchor";
import { WriteReviewButton } from "@/features/marketing/reviews/components/WriteReviewButton";
import { ProductDetails } from "@/features/products/components/ProductDetails";
import { ProductNotFoundResult } from "@/features/products/components/ProductNotFoundResult";
import { useProductQuery } from "@/features/products/providers/product-query";
import { assertValue } from "@/lib/assert-value";
import { Page } from "@/lib/components/Layout/Page";
import { InternalErrorResult } from "@/lib/components/Result/InternalErrorResult";
import { ResourceNotFoundException } from "@/lib/http/exceptions/resource-not-found-exception";
import { useTranslations } from "@/lib/i18n/use-transations";
import { useNavigate, useParams, useRouteError } from "@/lib/router";

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  assertValue(productId);
  const navigate = useNavigate();
  const { data } = useProductQuery(productId);
  const { data: marketingProduct } = useMarketingProductQuery(productId);
  const t = useTranslations("pages.product");
  const currentUserReview = useCurrentUserReview(productId);

  const handleSeeReviews = () => {
    document
      .getElementById(REVIEWS_ANCHOR_ID)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const initialRating = Math.round(marketingProduct?.rating.rate ?? 0);

  return (
    <Page gap={6}>
      <Button variant="plain" onClick={() => navigate("/products")}>
        <ArrowLeft />
        {t("back-to-list")}
      </Button>
      <ProductDetails product={data} onBack={() => navigate("/products")}>
        <ProductRating
          productId={productId}
          onSeeReviews={handleSeeReviews}
          hasReview={!!currentUserReview}
          writeReviewSlot={
            <WriteReviewButton
              productId={productId}
              initialRating={initialRating}
            />
          }
        />
      </ProductDetails>
      <ReviewList productId={productId} />
    </Page>
  );
};

export const Component = ProductPage;

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (error instanceof ResourceNotFoundException) {
    return <ProductNotFoundResult />;
  }

  return <InternalErrorResult />;
};
