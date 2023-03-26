import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

import { t } from "utils";
import { ResourceNotFoundException } from "utils";

import { Page } from "shared/Layout";
import { InternalErrorResult } from "shared/Result";
import { useNavigate, useParams, useRouteError } from "shared/Router";

import { useProductQuery } from "modules/products/infrastructure";
import { ProductDetails } from "modules/products/presentation";
import { ProductNotFoundResult } from "modules/products/presentation";

const ProductPage = () => {
  const params = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data } = useProductQuery(params.productId as string);

  return (
    <Page spacing={6}>
      <Button
        leftIcon={<ArrowBackIcon />}
        variant="link"
        onClick={() => navigate("/products")}
      >
        {t("Back to products' list")}
      </Button>
      <ProductDetails product={data!} onBack={() => navigate("/products")} />
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
