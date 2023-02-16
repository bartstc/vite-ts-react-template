import { ReactNode } from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "theme";

interface IProps {
  children: ReactNode;
}

const Providers = ({ children }: IProps) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

export { Providers };
