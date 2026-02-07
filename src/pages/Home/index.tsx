import { FeatureSection } from "@/features/marketing/components/FeatureSection";
import { HeroSection } from "@/features/marketing/components/HeroSection";
import { PricingSection } from "@/features/marketing/components/PricingSection";
import { useProductsQuery } from "@/features/products/providers/products-query";
import { Page } from "@/lib/components/Layout/Page";
import { InternalErrorResult } from "@/lib/components/Result/InternalErrorResult";
import { useRouteError } from "@/lib/router/use-route-error";

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
