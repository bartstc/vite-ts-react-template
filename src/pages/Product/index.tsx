import { Button } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";

import { ProductRating } from "@/features/marketing/rating/components/ProductRating";
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
  const t = useTranslations("pages.product");

  return (
    <Page gap={6}>
      <Button variant="plain" onClick={() => navigate("/products")}>
        <ArrowLeft />
        {t("back-to-list")}
      </Button>
      <ProductDetails product={data} onBack={() => navigate("/products")}>
        <ProductRating productId={productId} />
      </ProductDetails>
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
