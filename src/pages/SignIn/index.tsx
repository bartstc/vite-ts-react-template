import { Center } from "@chakra-ui/react";

import { withRequirePub } from "@/features/auth/application/withRequirePub";
import { SignInForm } from "@/features/auth/components/SignInForm";
import { Page } from "@/lib/components/Layout/Page";
import { ErrorPageStrategy } from "@/lib/components/Result/ErrorPageStrategy";

export const SignInPage = () => {
  return (
    <Page maxW="container.xl">
      <Center py={{ base: 10, md: 12 }}>
        <SignInForm initialUsername="mor_2314" initialPassword="83r5^_" />
      </Center>
    </Page>
  );
};

export const Component = withRequirePub(SignInPage, { to: "/products" });

export const ErrorBoundary = ErrorPageStrategy;
