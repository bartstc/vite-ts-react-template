import type { Decorator } from "@storybook/react-vite";
import { Suspense } from "react";
import { I18nextProvider } from "react-i18next";

import i18n from "../../lib/i18n/i18n";

export const withI18Next: Decorator = (Story) => {
  return (
    <Suspense fallback={<div>{"loading translations..."}</div>}>
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    </Suspense>
  );
};
