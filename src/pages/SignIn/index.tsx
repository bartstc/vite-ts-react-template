import { Center } from "@chakra-ui/react";

import { withRequirePub } from "@/features/auth/application/with-require-pub";
import { SignInForm } from "@/features/auth/components/SignInForm";
import { Page } from "@/lib/components/Layout/Page";
import { ErrorPageStrategy } from "@/lib/components/Result/ErrorPageStrategy";

export const SignInPage = () => {
  return (
    <Page maxW="container.xl">
      <Center py={{ base: 10, md: 12 }}>
        <SignInForm initialUsername="bob" initialPassword="Pa$$w0rd" />
      </Center>
    </Page>
  );
};

// AIDEV-NOTE: HOC-wrapped route export — see pages/Cart for why this is suppressed.
// eslint-disable-next-line react-refresh/only-export-components
export const Component = withRequirePub(SignInPage, { to: "/products" });

export const ErrorBoundary = ErrorPageStrategy;
