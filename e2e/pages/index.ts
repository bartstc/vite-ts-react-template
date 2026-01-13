/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test";

import { SignInPage } from "@e2e/pages/auth/SignInPage";

interface PageFixtures {
  signInPage: SignInPage;
}

export const test = base.extend<PageFixtures>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
});

export { expect } from "@playwright/test";
