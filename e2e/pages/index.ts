/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test";

import { SignInPage } from "@e2e/pages/auth/SignInPage";
import { CartPage } from "@e2e/pages/cart/CartPage";
import { ProductDetailsPage } from "@e2e/pages/products/ProductDetailsPage";
import { ProductListPage } from "@e2e/pages/products/ProductListPage";

interface PageFixtures {
  resetDb: void;
  signInPage: SignInPage;
  productListPage: ProductListPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
}

const API_BASE = process.env.VITE_API ?? "http://localhost:3001/api";

export const test = base.extend<PageFixtures>({
  // AIDEV-NOTE: Auto fixture — resets DB to seed state before every test for isolation
  resetDb: [
    async ({ request }, use) => {
      await request.post(`${API_BASE}/test/reset`);
      await use();
    },
    { auto: true },
  ],
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  productListPage: async ({ page }, use) => {
    await use(new ProductListPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from "@playwright/test";
