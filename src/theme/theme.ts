import { extendTheme } from "@chakra-ui/react";

const config = {
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});
