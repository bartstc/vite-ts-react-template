import { createElement } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { initialize, mswLoader } from "msw-storybook-addon";

import { theme } from "../src/theme";
import { getUserHandler, withAuth, withReactQuery } from "../src/utils";

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

initialize(
  {
    onUnhandledRequest: (req, print) => {
      if (!req.url.host.includes("api")) {
        return;
      }

      print.warning();
    },
  },
  [getUserHandler()]
);

export const decorators = [
  (story) => createElement(ChakraProvider, { children: story(), theme }),
  withReactQuery,
  withAuth,
];

export const loaders = [mswLoader];
