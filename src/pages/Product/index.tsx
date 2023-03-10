import { useNavigate, useParams } from "react-router-dom";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { VStack, Button } from "@chakra-ui/react";

import { t } from "utils";

import { Page } from "shared/Layout";

import { useProductQuery } from "modules/products/infrastructure";
import { ProductDetails } from "modules/products/presentation";

const ProductPage = () => {
  const params = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useProductQuery(params.productId as string);

  // todo: loading case...
  if (isLoading || !data) {
    return <h1>Loading ...</h1>;
  }

  return (
    <Page>
      <VStack display="stretch" spacing={6}>
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="link"
          onClick={() => navigate("/products")}
        >
          {t("Back to products' list")}
        </Button>
        <ProductDetails product={data!} onBack={() => navigate("/products")} />
      </VStack>
    </Page>
  );
};

export { ProductPage };
