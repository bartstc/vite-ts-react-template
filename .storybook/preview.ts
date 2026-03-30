import { initialize, mswLoader } from "msw-storybook-addon";
import { createElement } from "react";

import { DesignProvider } from "@/app/design/DesignProvider";
import { getUserHandler } from "@/test-lib/handlers/get-user-handler";
import { withAuth } from "@/test-lib/storybook/with-auth";
import { withI18Next } from "@/test-lib/storybook/with-i18next";
import { withReactQuery } from "@/test-lib/storybook/with-react-query";

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  a11y: {
    disable: true,
    // 'todo' - show a11y violations in the test UI only
    // 'error' - fail CI on a11y violations
    // 'off' - skip a11y checks entirely
    test: "todo",
  },
};

initialize(
  {
    onUnhandledRequest: (req, print) => {
      if (!req.url.includes("api")) {
        return;
      }

      print.warning();
    },
  },
  [getUserHandler()]
);

export const decorators = [
  // eslint-disable-next-line react/no-children-prop, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
  (story: any) => createElement(DesignProvider, { children: story() }),
  withI18Next,
  withReactQuery,
  withAuth,
];

export const loaders = [mswLoader];
