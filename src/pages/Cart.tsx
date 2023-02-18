import { Heading, VStack } from "@chakra-ui/react";

import { t } from "utils";

import { Layout, PageHeader } from "shared/Layout";

const Cart = () => {
  return (
    <Layout>
      <VStack display="stretch" spacing={10}>
        <PageHeader
          title={t("List of selected products")}
          description={t("These are all products that you yet chose.")}
        />
        <Heading>Cart Screen</Heading>
      </VStack>
    </Layout>
  );
};

export { Cart };
