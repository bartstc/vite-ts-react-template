# Anti-Patterns

Common mistakes in E2E tests and page objects, and what to do instead. The reasons are in `docs/e2e-testing.md`.

## 1. One-shot assertions

A value read once passes or fails on timing luck.

```ts
// ❌
expect(await cartPage.heading.isVisible()).toBe(true);
expect(await header.cartBadge.textContent()).toBe("1");
expect(page.url()).toContain("/cart");

// ✅ web-first — retries until it passes or times out
await expect(cartPage.heading).toBeVisible();
await expect(header.cartBadge).toHaveText("1");
await expect(page).toHaveURL(/\/cart/);
```

## 2. Sleeps and network waits

```ts
// ❌
await page.waitForTimeout(2000);
await page.goto("/products", { waitUntil: "networkidle" });
await page.waitForResponse((r) => r.url().includes("/api/carts")); // inside a page object

// ✅ wait for what the next step needs
await page.goto("/products");
await expect(productListPage.heading).toBeVisible();
```

When no UI reflects the result, wait in the test, not the page object: see `waiting-and-assertions.md`.

## 3. Value getters on page objects

```ts
// ❌ returns a snapshot; the test cannot wait for it
async getErrorMessage() {
  return this.errorMessage.textContent();
}

// ✅ expose the locator; the test asserts
readonly errorMessage: Locator;
await expect(signInPage.errorMessage).toContainText(/invalid credentials/i);
```

## 4. Business assertions inside page objects

```ts
// ❌ hidden test logic
async verifyItemInCart(title: string) {
  await expect(this.item(title)).toBeVisible();
}
```

Only the readiness check at the end of a navigation method is allowed.

## 5. Silencing strict mode

```ts
// ❌ several elements match — `.first()` picks one at random-ish
await page
  .getByRole("button", { name: /add to cart/i })
  .first()
  .click();

// ✅ scope to the item the path is about
await productListPage.card(product.title).addToCart();
```

`nth`, `first` and `last` only when order itself is the behaviour.

## 6. Routing our own API

```ts
// ❌ the real contract is the point of E2E
await page.route("**/api/carts/**", (route) =>
  route.fulfill({ json: emptyCart })
);
```

Seed the state through the API, or move the test to a story with MSW.

## 7. UI setup and order dependence

```ts
// ❌ every test pays for signing in through the form, and fails if the form breaks
test.beforeEach(async ({ signInPage }) => {
  await signInPage.goto();
  await signInPage.signIn(USER.username, USER.password);
});
```

Use the saved `storageState` from the auth setup project, and data fixtures for everything else.

## 8. Story-tier matrices in E2E

```ts
// ❌ every validation message, every field with a non-default value
test("shows an error for an empty username", …);
test("shows an error for a short password", …);
```

Keep one path through the screen in E2E; the matrix belongs in stories.

## 9. Inheritance and fat page objects

```ts
// ❌
class BasePage { async waitForPageLoad() { … } }
class ProductListPage extends BasePage { /* 40 locators */ }

// ✅ compose
class ProductListPage {
  readonly header: HeaderComponent;
  readonly filters: ProductFiltersComponent;
}
```

## 10. CSS, XPath and test-id strings

```ts
// ❌
page.locator(".product-card > button.primary");
page.locator('[data-testid="cart-badge"]');

// ✅ role first; getByTestId only with a comment saying why roles do not work
page.getByRole("button", { name: /add to cart/i });
page.getByTestId("cart-badge"); // badge has no accessible name yet — AIDEV-TODO: add aria-label
```

## 11. Wrapping Playwright

```ts
// ❌ adds nothing
async click(locator: Locator) {
  await locator.click();
}
```

## 12. Toasts as page-object properties

Transient UI is asserted in the test: `await expect(page.getByRole("status")).toHaveText(/added/i)`.

## 13. All members public

```ts
// ❌ tests can reach internals and start depending on them
class OrdersPage {
  loadingIndicator: Locator;
  retryCount: number;
}

// ✅ public surface is what tests need; the rest is private
class OrdersPage {
  readonly table: Locator;
  private readonly loadingIndicator: Locator;
}
```

## Summary

| Anti-pattern                  | Fix                                       |
| ----------------------------- | ----------------------------------------- |
| One-shot assertions           | Web-first matchers on locators            |
| Sleeps, `networkidle`         | Assert the UI state the next step needs   |
| Value getters                 | Expose `readonly` locators                |
| Business assertions in POMs   | Assert in the test; readiness checks only |
| `.first()` for strict mode    | Scope or filter the locator               |
| Routing our own API           | Seed via API, or a story with MSW         |
| UI setup in `beforeEach`      | `storageState` and data fixtures          |
| Field/state matrices          | Stories                                   |
| Inheritance, fat POMs         | Component objects                         |
| CSS / XPath / test-id strings | Role-based locators                       |
| Wrapping Playwright           | Call Playwright directly                  |
| Toasts in POMs                | Assert in the test                        |
| All members public            | `private` for internals                   |
