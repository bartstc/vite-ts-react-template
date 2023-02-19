import { useState } from "react";

import { SettingsIcon } from "@chakra-ui/icons";
import { Button, VStack } from "@chakra-ui/react";

import { IQueryParams } from "types";

import { t } from "utils";

import { Layout, PageHeader } from "shared/Layout";
import { useNotImplementedYetToast } from "shared/Toast";

import { useProductsQuery } from "modules/products/infrastructure";
import { ProductsList } from "modules/products/presentation";

const defaultParams: IQueryParams = { limit: 10, sort: "asc" };

const Products = () => {
  const notImplemented = useNotImplementedYetToast();

  const [params, setParams] = useState<IQueryParams>(defaultParams);
  const { data, isLoading, isFetching } = useProductsQuery(params, {
    keepPreviousData: true,
  });

  // todo: loading case...
  if (isLoading || !data) {
    return <h1>Loading ...</h1>;
  }

  const noMoreProducts = data.meta.total <= params.limit;

  return (
    <Layout>
      <VStack display="stretch" spacing={10}>
        <PageHeader
          title={t("Products list")}
          description={t("Explore what we have in the store for you.")}
        >
          <Button leftIcon={<SettingsIcon />} onClick={notImplemented}>
            {t("More filters")}
          </Button>
        </PageHeader>
        <ProductsList products={data.products} />
        <Button
          w="100%"
          onClick={() =>
            setParams((params) => ({
              ...params,
              limit: (params?.limit ?? 10) + 10,
            }))
          }
          isLoading={isFetching}
          isDisabled={noMoreProducts}
        >
          {noMoreProducts ? t("No more products") : t("Show more products")}
        </Button>
      </VStack>
    </Layout>
  );
};

export { Products };
