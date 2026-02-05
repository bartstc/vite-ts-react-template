# Fixtures Pattern

Playwright's official recommended approach for page object management, replacing traditional PageManager aggregation patterns.

## Why Fixtures Beat PageManager

| Aspect                     | Fixtures Pattern               | PageManager Pattern          |
| -------------------------- | ------------------------------ | ---------------------------- |
| **Test isolation**         | Each test gets fresh instances | Shared state risks pollution |
| **Memory efficiency**      | Only instantiates needed POMs  | Often instantiates all POMs  |
| **TypeScript integration** | Native type inference          | Manual typing required       |
| **Parallel execution**     | Designed for parallelism       | Requires careful management  |
| **Setup/teardown**         | Encapsulated per fixture       | Global hooks complexity      |

## Implementation

```typescript
// e2e/pages/index.ts
import { test as base } from "@playwright/test";
import { SignInPage } from "./auth/SignInPage";
import { ProductListPage } from "./products/ProductListPage";
import { ProductDetailsPage } from "./products/ProductDetailsPage";
import { CartPage } from "./cart/CartPage";
import { CheckoutPage } from "./checkout/CheckoutPage";

type PageFixtures = {
  signInPage: SignInPage;
  productListPage: ProductListPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

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
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from "@playwright/test";
```

## Usage in Tests

Tests consume fixtures with full type safety:

```typescript
// e2e/tests/checkout.spec.ts
import { test, expect } from "../pages";

test("complete purchase flow", async ({
  productListPage,
  cartPage,
  checkoutPage,
}) => {
  await productListPage.goto();
  await productListPage.addProductToCart("Premium Headphones");
  await cartPage.proceedToCheckout();
  await checkoutPage.completeCheckout(shippingData, paymentData);

  await expect(checkoutPage.confirmationSection).toBeVisible();
});
```

## Authentication Setup

Use setup projects to authenticate once and share state:

```typescript
// e2e/auth.setup.ts
import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(process.env.TEST_USER!);
  await page.getByLabel("Password").fill(process.env.TEST_PASSWORD!);
  await page.getByRole("button", { name: "Sign In" }).click();

  await page.waitForURL("/products");
  await page.context().storageState({ path: authFile });
});
```

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      use: { storageState: "playwright/.auth/user.json" },
      dependencies: ["setup"],
    },
  ],
});
```

**Critical:** Add `playwright/.auth/` to `.gitignore` — storage state contains sensitive session data.
