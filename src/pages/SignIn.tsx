import { Center } from "@chakra-ui/react";

import { Layout } from "shared/Layout";

import { SignInForm } from "modules/auth/presentation";

const SignIn = () => {
  return (
    <Layout maxW="1340px">
      <Center py={{ base: 10, md: 12 }}>
        <SignInForm />
      </Center>
    </Layout>
  );
};

export { SignIn };
