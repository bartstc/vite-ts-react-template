import { SettingsIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";

import { ProductsList } from "@/features/products/components/ProductsList";
import { useProductsQuery } from "@/features/products/providers/productsQuery";
import { Page } from "@/lib/components/Layout/Page";
import { PageHeader } from "@/lib/components/Layout/PageHeader";
import { ErrorPageStrategy } from "@/lib/components/Result/ErrorPageStrategy";
import { useNotImplementedYetToast } from "@/lib/components/Toast/useNotImplementedYetToast";
import { useTranslations } from "@/lib/i18n/useTransations";
import type { IQueryParams } from "@/types/IQueryParams";

const defaultParams: IQueryParams = { limit: 10, sort: "asc" };

const ProductsPage = () => {
  const notImplemented = useNotImplementedYetToast();
  const t = useTranslations("pages.products");

  const [params, setParams] = useState<IQueryParams>(defaultParams);
  const { data, isFetching } = useProductsQuery(params, {
    placeholderData: keepPreviousData,
  });

  const noMoreProducts = data.meta.total <= params.limit;

  return (
    <Page>
      <PageHeader title={t("title")} description={t("description")}>
        <Button leftIcon={<SettingsIcon />} onClick={notImplemented}>
          {t("more-filters")}
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
          {noMoreProducts ? t("load-more.no-more") : t("load-more.show-more")}
        </Button>
      )}
    </Page>
  );
};

export const Component = ProductsPage;

export const ErrorBoundary = ErrorPageStrategy;
