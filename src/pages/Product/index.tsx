import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

import { ProductDetails } from "@/features/products/components/ProductDetails";
import { ProductNotFoundResult } from "@/features/products/components/ProductNotFoundResult";
import { useProductQuery } from "@/features/products/providers/productQuery";
import { Page } from "@/lib/components/Layout/Page";
import { InternalErrorResult } from "@/lib/components/Result/InternalErrorResult";
import { ResourceNotFoundException } from "@/lib/http/exceptions/ResourceNotFoundException";
import { useTranslations } from "@/lib/i18n/useTransations";
import { useNavigate, useParams, useRouteError } from "@/lib/router";

const ProductPage = () => {
  const params = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data } = useProductQuery(params.productId!);
  const t = useTranslations("pages.product");

  return (
    <Page spacing={6}>
      <Button
        leftIcon={<ArrowBackIcon />}
        variant="link"
        onClick={() => navigate("/products")}
      >
        {t("back-to-list")}
      </Button>
      <ProductDetails product={data} onBack={() => navigate("/products")} />
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
