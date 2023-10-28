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

export const lightTheme = extendTheme({
  config: {
    ...config,
    initialColorMode: "light",
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});

export const darkTheme = extendTheme({
  config: {
    ...config,
    initialColorMode: "dark",
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});
