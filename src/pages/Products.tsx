import { Heading, VStack } from "@chakra-ui/react";

import { t } from "utils";

import { Layout, PageHeader } from "shared/Layout";

const Products = () => {
  return (
    <Layout>
      <VStack display="stretch" spacing={10}>
        <PageHeader
          title={t("Products list")}
          description={t("Explore what we have in the store for you.")}
        />
        <Heading>Products Screen</Heading>
      </VStack>
    </Layout>
  );
};

export { Products };
