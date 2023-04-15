import { Page } from "shared/Layout";
import { InternalErrorResult } from "shared/Result";
import { useRouteError } from "shared/Router";

import {
  HeroSection,
  FeatureSection,
  PricingSection,
} from "modules/marketing/presentation";
import { useProductsQuery } from "modules/products/infrastructure";

interface IProps {
  fallbackProductsNumber?: number;
}

const HomePage = ({ fallbackProductsNumber }: IProps) => {
  const { data } = useProductsQuery();

  return (
    <Page maxW="container.xl" spacing={{ base: 8, lg: 20 }}>
      <HeroSection
        productNumber={fallbackProductsNumber ?? data?.meta.total ?? 0}
      />
      <FeatureSection />
      <PricingSection />
    </Page>
  );
};

export const Component = HomePage;

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (error.status === 404) {
    return <HomePage fallbackProductsNumber={20} />;
  }

  return <InternalErrorResult />;
};
