import { ReactNode } from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { theme } from "theme";

const queryClient = new QueryClient();

interface IProps {
  children: ReactNode;
}

const Providers = ({ children }: IProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </QueryClientProvider>
  );
};

export { Providers };
