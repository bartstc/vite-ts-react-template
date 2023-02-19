import { VStack } from "@chakra-ui/react";

import { Layout } from "shared/Layout";

import {
  HeroSection,
  FeatureSection,
  PricingSection,
} from "modules/marketing/presentation";
import { useProductsQuery } from "modules/products/infrastructure";

const Home = () => {
  const { data } = useProductsQuery();

  return (
    <Layout maxW="1340px">
      <VStack display="stretch" spacing={{ base: 8, lg: 20 }}>
        <HeroSection productNumber={data?.meta.total ?? 0} />
        <FeatureSection />
        <PricingSection />
      </VStack>
    </Layout>
  );
};

export { Home };
