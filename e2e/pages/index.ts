/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test";

import { SignInPage } from "@e2e/pages/auth/SignInPage";
import { ProductDetailsPage } from "@e2e/pages/products/ProductDetailsPage";
import { ProductListPage } from "@e2e/pages/products/ProductListPage";

interface PageFixtures {
  signInPage: SignInPage;
  productListPage: ProductListPage;
  productDetailsPage: ProductDetailsPage;
}

export const test = base.extend<PageFixtures>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  productListPage: async ({ page }, use) => {
    await use(new ProductListPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
});

export { expect } from "@playwright/test";
