import { Navigate } from "react-router-dom";

import { Center } from "@chakra-ui/react";

import { Page } from "shared/Layout";

import { useAuthStore } from "modules/auth/application";
import { SignInForm } from "modules/auth/presentation";

const SignInPage = () => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  return (
    <Page maxW="1340px">
      <Center py={{ base: 10, md: 12 }}>
        <SignInForm />
      </Center>
    </Page>
  );
};

export { SignInPage };
