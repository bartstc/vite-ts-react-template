import { VStack } from "@chakra-ui/react";

import { Layout } from "shared/Layout";

import { Demo } from "modules/demo/presentation";

const Home = () => {
  return (
    <Layout maxW="1340px">
      <VStack display="stretch" spacing={{ base: 8, lg: 20 }}>
        <Demo />
      </VStack>
    </Layout>
  );
};

export { Home };
