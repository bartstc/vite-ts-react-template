import { useState } from "react";

import { SettingsIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

import { IQueryParams } from "types";

import { t } from "utils";

import { Page, PageHeader } from "shared/Layout";
import { ErrorPageStrategy } from "shared/Result";
import { useNotImplementedYetToast } from "shared/Toast";

import { useProductsQuery } from "modules/products/infrastructure";
import { ProductsList } from "modules/products/presentation";

const defaultParams: IQueryParams = { limit: 10, sort: "asc" };

const ProductsPage = () => {
  const notImplemented = useNotImplementedYetToast();

  const [params, setParams] = useState<IQueryParams>(defaultParams);
  const { data, isFetching } = useProductsQuery(params, {
    keepPreviousData: true,
  });

  const noMoreProducts = data.meta.total <= params.limit;

  return (
    <Page>
      <PageHeader
        title={t("Products list")}
        description={t("Explore what we have in the store for you.")}
      >
        <Button leftIcon={<SettingsIcon />} onClick={notImplemented}>
          {t("More filters")}
        </Button>
      </PageHeader>
      <ProductsList products={data.products} />
      {data.products.length > 0 && (
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
      )}
    </Page>
  );
};

export const Component = ProductsPage;

export const ErrorBoundary = ErrorPageStrategy;
