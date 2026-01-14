/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test";

import { SignInPage } from "@e2e/pages/auth/SignInPage";
import { ProductListPage } from "@e2e/pages/products/ProductListPage";

interface PageFixtures {
  signInPage: SignInPage;
  productListPage: ProductListPage;
}

export const test = base.extend<PageFixtures>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  productListPage: async ({ page }, use) => {
    await use(new ProductListPage(page));
  },
});

export { expect } from "@playwright/test";
