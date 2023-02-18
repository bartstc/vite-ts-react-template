import { ReactNode } from "react";

import { chakra, Box, ChakraProps } from "@chakra-ui/react";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

interface IProps {
  children: ReactNode;
  maxW?: ChakraProps["maxW"];
}

export const Layout = ({ children, maxW = "1000px" }: IProps) => {
  return (
    <chakra.main>
      <Navbar />
      <Box
        px={{ base: 3, md: 4 }}
        maxW={maxW}
        m="0 auto"
        py={{ base: 4, md: 6 }}
      >
        {children}
      </Box>
      <Footer />
    </chakra.main>
  );
};
