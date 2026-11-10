# Fixtures

Playwright fixtures provide everything a test needs: page objects, seeded data, auth state. Each test gets fresh
instances, only the fixtures it asks for are built, and teardown runs even when the test fails.

## Constraints

- One entry point, `e2e/fixtures/index.ts`, merges the fixture modules with `mergeTests` and re-exports `expect`. Specs
  import only from it. It is the only barrel in `e2e/`.
- **Page fixtures** construct a page object from `page`. Nothing else.
- **Data fixtures** seed through the `request` fixture and the typed helpers in `e2e/api/`; they never touch `page`.
- Under an **own-your-data** strategy, cleanup goes after `await use(...)`, and names are unique per test.
  Under **reset-to-seed**, an automatic fixture resets the database and data fixtures need no cleanup
  (`docs/e2e-testing.md` §2.2).
- Test scope by default. `{ scope: "worker" }` only for expensive, read-only data.
- Flows several specs drive through the UI on purpose may be a fixture that depends on page fixtures. Setup flows
  (sign in, create an entity) are data or auth fixtures, not UI flows.
- Type every fixture in the `extend<…>` generic.

## Example — page fixtures

```ts
// e2e/fixtures/pages-fixture.ts
import { test as base } from "@playwright/test";

import { CartPage } from "@e2e/pages/cart/CartPage";
import { ProductDetailsPage } from "@e2e/pages/products/ProductDetailsPage";

interface PageFixtures {
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
}

export const test = base.extend<PageFixtures>({
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});
```

## Example — seeding helper

```ts
// e2e/api/products-api.ts — typed, throws with status and body, no page, no UI assertions
import type { APIRequestContext } from "@playwright/test";

import type { ProductDto } from "@/lib/api/products/{product-id}/product-dto";

const API_URL = process.env.VITE_API ?? "http://localhost:3001/api";

export async function createProduct(
  request: APIRequestContext,
  body: Omit<ProductDto, "id">
): Promise<ProductDto> {
  const response = await request.post(`${API_URL}/products`, { data: body });
  if (!response.ok()) {
    throw new Error(
      `createProduct failed: ${response.status()} ${await response.text()}`
    );
  }
  return response.json();
}

export async function deleteProduct(
  request: APIRequestContext,
  id: string
): Promise<void> {
  await request.delete(`${API_URL}/products/${id}`);
}
```

## Example — data fixture (own your data)

```ts
// e2e/fixtures/data-fixture.ts
import { test as base } from "@playwright/test";

import { createProduct, deleteProduct } from "@e2e/api/products-api";
import type { ProductDto } from "@/lib/api/products/{product-id}/product-dto";
import { ProductFixture } from "@/test-lib/fixtures/product-fixture";

interface DataFixtures {
  product: ProductDto;
}

export const test = base.extend<DataFixtures>({
  product: async ({ request }, use, testInfo) => {
    const product = await createProduct(request, {
      ...ProductFixture.toStructure(),
      title: `e2e-product-w${testInfo.workerIndex}-${Date.now()}`,
    });
    await use(product);
    await deleteProduct(request, product.id); // runs even when the test fails
  },
});
```

## Example — reset-to-seed (automatic)

```ts
export const test = base.extend<{ resetDb: void }>({
  // AIDEV-NOTE: resets the shared database before every test — requires a single worker
  resetDb: [
    async ({ request }, use) => {
      await request.post(`${API_URL}/test/reset`);
      await use();
    },
    { auto: true },
  ],
});
```

## Example — entry point

```ts
// e2e/fixtures/index.ts
import { mergeTests } from "@playwright/test";

import { test as data } from "@e2e/fixtures/data-fixture";
import { test as pages } from "@e2e/fixtures/pages-fixture";

export const test = mergeTests(pages, data);
export { expect } from "@playwright/test";
```

## Anti-patterns

```ts
// ❌ page object built in the test
const cartPage = new CartPage(page);

// ❌ cleanup in afterEach, scattered across specs
test.afterEach(async ({ request }) => { … });

// ❌ data fixture that seeds through the UI
product: async ({ page }, use) => { /* fills the create-product form */ },

// ❌ spec imports test from Playwright directly — misses the project fixtures
import { test } from "@playwright/test";
```
