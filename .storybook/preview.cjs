import { ChakraProvider } from "@chakra-ui/react";
import { withThemeFromJSXProvider } from "@storybook/addon-styling";
import { initialize, mswLoader } from "msw-storybook-addon";

import { theme } from "../src/theme";
import { withAuth, withReactQuery } from "../src/utils";

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
    if (!req.url.pathname.includes("fakestoreapi")) {
      return;
    }

    print.warning();
  },
});

export const decorators = [
  // (story) => React.createElement(ChakraProvider, { children: story(), theme }),
  // todo: handle modes switch
  withThemeFromJSXProvider({
    themes: { light: theme, dark: theme },
    Provider: ChakraProvider,
    defaultTheme: "light",
  }),
  withReactQuery,
  withAuth,
];

export const loaders = [mswLoader];
