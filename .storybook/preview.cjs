import React from "react";

import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../src/theme";
import { withReactQuery } from "../src/utils";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  a11y: { disable: true },
};

export const decorators = [
  (story) => React.createElement(ChakraProvider, { children: story(), theme }),
  withReactQuery(),
];
