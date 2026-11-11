/* eslint-disable react-hooks/rules-of-hooks -- Playwright fixture `use`, not a React hook */
import { test as base } from "@playwright/test";

import type { ProductDto } from "@/lib/api/products/{product-id}/product-dto";
import { getAuthToken } from "@e2e/api/auth-api";
import { createMarketingProduct } from "@e2e/api/marketing-api";
import { createProduct, listProducts } from "@e2e/api/products-api";
import { ValidUserCredentials } from "@e2e/fixtures/credentials-fixture";

interface DataFixtures {
  /** A new product, reachable by its id. Reset-to-seed removes it, so no cleanup. */
  product: ProductDto;
  /** A seeded product shown on the first page of the products list. */
  listedProduct: ProductDto;
}

export const test = base.extend<DataFixtures>({
  product: async ({ request }, use) => {
    const token = await getAuthToken(request, {
      username: ValidUserCredentials.user.username,
      password: ValidUserCredentials.password,
    });
    const product = await createProduct(request, token, {
      name: `e2e-product-${Date.now()}`,
    });
    await createMarketingProduct(request, token, product.id);
    await use(product);
  },
  // AIDEV-NOTE: the list is paginated by addedAt asc, so a new product is not on page 1 — use a seeded one
  listedProduct: async ({ request }, use) => {
    const [first] = await listProducts(request);
    if (!first)
      throw new Error("listedProduct: the seeded products list is empty");
    await use(first);
  },
});
