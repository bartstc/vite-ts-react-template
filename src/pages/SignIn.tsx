import { Navigate } from "react-router-dom";

import { Center } from "@chakra-ui/react";

import { Layout } from "shared/Layout";

import { useAuthStore } from "modules/auth/application";
import { SignInForm } from "modules/auth/presentation";

const SignIn = () => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  return (
    <Layout maxW="1340px">
      <Center py={{ base: 10, md: 12 }}>
        <SignInForm />
      </Center>
    </Layout>
  );
};

export { SignIn };
