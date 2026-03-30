import { Button } from "@chakra-ui/react";
import { keepPreviousData } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { useState } from "react";

import { ProductsList } from "@/features/products/components/ProductsList";
import { useProductsQuery } from "@/features/products/providers/products-query";
import { Page } from "@/lib/components/Layout/Page";
import { PageHeader } from "@/lib/components/Layout/PageHeader";
import { ErrorPageStrategy } from "@/lib/components/Result/ErrorPageStrategy";
import { useNotImplementedYetToast } from "@/lib/components/Toast/use-not-implemented-yet-toast";
import { useTranslations } from "@/lib/i18n/use-transations";
import type { QueryParams } from "@/types/query-params";

const defaultParams: QueryParams = { limit: 10, sort: "asc" };

const ProductsPage = () => {
  const notImplemented = useNotImplementedYetToast();
  const t = useTranslations("pages.products");

  const [params, setParams] = useState<QueryParams>(defaultParams);
  const { data, isFetching } = useProductsQuery(params, {
    placeholderData: keepPreviousData,
  });

  const noMoreProducts = data.meta.total <= params.limit;

  return (
    <Page>
      <PageHeader title={t("title")} description={t("description")}>
        <Button onClick={notImplemented}>
          <Settings />
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
          loading={isFetching}
          disabled={noMoreProducts}
        >
          {noMoreProducts ? t("load-more.no-more") : t("load-more.show-more")}
        </Button>
      )}
    </Page>
  );
};

export const Component = ProductsPage;

export const ErrorBoundary = ErrorPageStrategy;
