import { setupWorker } from "msw/browser";
import { mswLoader } from "msw-storybook-addon/csf3";
import { createElement } from "react";

import { DesignProvider } from "@/app/design/DesignProvider";
import { getUserHandler } from "@/test-lib/handlers/get-user-handler";
import { withAuth } from "@/test-lib/storybook/with-auth";
import { withI18Next } from "@/test-lib/storybook/with-i18next";
import { withQueryProvider } from "@/test-lib/storybook/with-query-provider";

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

// AIDEV-NOTE: v3 dropped `initialize()`; the worker is now created and started here.
const setupMswWorker = async () => {
  const worker = setupWorker(getUserHandler());

  await worker.start({
    onUnhandledRequest: (req, print) => {
      if (!req.url.includes("api")) {
        return;
      }

      print.warning();
    },
  });

  return worker;
};

export const decorators = [
  // eslint-disable-next-line react/no-children-prop, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
  (story: any) => createElement(DesignProvider, { children: story() }),
  withI18Next,
  withQueryProvider,
  withAuth,
];

export const loaders = [mswLoader(setupMswWorker)];
