import React from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { initialize, mswDecorator } from "msw-storybook-addon";

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

initialize({
  onUnhandledRequest: (req, print) => {
    const pathsToIgnore = ["/node_modules/.cache", "/src", "/iframe.html"];

    if (pathsToIgnore.some((path) => req.url.pathname.startsWith(path))) {
      return;
    }

    print.warning();
  },
});

export const decorators = [
  (story) => React.createElement(ChakraProvider, { children: story(), theme }),
  withReactQuery(),
  mswDecorator,
];
