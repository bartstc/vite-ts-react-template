import { ReactNode } from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { theme } from "theme";

import { queryClient } from "utils";

import { AuthProvider } from "modules/auth/application";

interface IProps {
  children: ReactNode;
}

const Providers = ({ children }: IProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>{children}</AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export { Providers };
