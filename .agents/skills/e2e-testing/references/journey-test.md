# Journey Test

One test per critical business path. The path crosses pages or depends on the real API; it walks through each screen
once and asserts the outcome only the real stack can show.

## Constraints

- File: `e2e/tests/<area>/<path>.spec.ts`. Related paths share a `test.describe`.
- `test` and `expect` come from the fixtures module, never from `@playwright/test`.
- Preconditions are fixtures in the test signature (seeded data, signed-in state). No UI clicking to set up.
- The test name states the user outcome, not the steps: `"adds a product and sees it in the cart"`.
- Phases are `test.step`s, not comments. Each step ends with a web-first assertion on the state the next step needs.
- The final step asserts the outcome the path exists for; it would fail if the path broke.
- Values crossing from arrange to assert come from the seeded fixture or a constant — never re-typed literals.
- A path that needs a different auth state sets it with `test.use({ storageState: … })` at describe level.
- No `beforeEach` that drives the UI. Navigation to the starting page is the first step.
- Fill only what the path needs; field and state matrices belong in stories.

## Example

```ts
import { expect, test } from "@e2e/fixtures";

test.describe("Cart", () => {
  test("adds a product from its details page and sees it in the cart", async ({
    product, // data fixture — seeded through the API
    productDetailsPage,
    cartPage,
  }) => {
    await test.step("open the product", async () => {
      await productDetailsPage.goto(product.id);
      await expect(productDetailsPage.heading).toHaveText(product.title);
    });

    await test.step("add it to the cart", async () => {
      await productDetailsPage.addToCart();
      await expect(productDetailsPage.addedDialog.root).toBeVisible();
    });

    await test.step("the cart lists it", async () => {
      await productDetailsPage.addedDialog.goToCart();
      await expect(cartPage.item(product.title)).toBeVisible();
    });
  });
});
```

## Example — signed-out path

```ts
test.describe("Sign in", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("signs in and lands on the products page", async ({
    signInPage,
    page,
  }) => {
    await test.step("sign in", async () => {
      await signInPage.goto();
      await signInPage.signIn(USER.username, USER.password);
    });

    await test.step("lands signed in", async () => {
      await expect(page).toHaveURL(/\/products$/);
      await expect(signInPage.header.signOutButton).toBeVisible();
    });
  });
});
```

How each step waits and what it asserts: [waiting-and-assertions.md](waiting-and-assertions.md).

## Anti-patterns

```ts
// ❌ one test per step — the second test fakes what the first one produced
test("opens the product", …);
test("adds the product to the cart", …);

// ❌ UI setup before the path
test.beforeEach(async ({ signInPage }) => {
  await signInPage.goto();
  await signInPage.signIn(USER.username, USER.password);
});

// ❌ no final outcome — the test ends on an action
await productDetailsPage.addToCart();

// ❌ enumerating a screen's states in E2E
test("shows an error for an empty username", …);
test("shows an error for a short password", …);
```
