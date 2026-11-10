# Page and Component Objects

Page objects hide _how_ to find and drive the UI. The test decides _what_ to check.

## Constraints

- One class per page and workflow: `e2e/pages/<area>/<Name>Page.ts`. Shared UI (header, dialogs, cards, tables) is a
  component object in `e2e/pages/components/`.
- Public locators are `readonly` properties or locator-returning methods (`item(name)`). Tests assert on them.
- Multi-control actions are methods. A single click may be done on the locator in the test.
- `goto()` and other navigation methods end with a readiness check (`await expect(this.heading).toBeVisible()`) and
  return the target page object when the page changes. Plain actions return `Promise<void>`.
- No other assertions, no value getters (`textContent()`, `isVisible()`, `count()`), no API URLs, no
  `waitForResponse`.
- No `BasePage` and no inheritance. Compose component objects as properties.
- Component objects take a root `Locator` (or build one by role and accessible name) and scope every child to it.
- Containers are found by `getByRole("dialog" | "form" | "region" | "navigation" | "article", { name })`. If one has no
  accessible name, add it in the component.
- Items in a collection are found by content (`filter({ has: … })`), not by index.
- Helpers and sub-locators tests should not use are `private`.
- Split when a class passes ~15 locators or ~10 methods.

## Example — page object

```ts
import { expect, type Locator, type Page } from "@playwright/test";

import { AddedToCartDialog } from "@e2e/pages/components/AddedToCartDialog";
import { HeaderComponent } from "@e2e/pages/components/HeaderComponent";

export class ProductDetailsPage {
  readonly header: HeaderComponent;
  readonly heading: Locator;
  readonly addedDialog: AddedToCartDialog;
  private readonly addToCartButton: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.heading = page.getByRole("heading", { level: 1 });
    this.addedDialog = new AddedToCartDialog(page);
    this.addToCartButton = page.getByRole("button", { name: /add to cart/i });
  }

  async goto(id: string): Promise<void> {
    await this.page.goto(`/products/${id}`);
    await expect(this.heading).toBeVisible(); // readiness check — the only assertion allowed
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
```

## Example — list page with items found by content

```ts
export class CartPage {
  readonly heading: Locator;
  private readonly items: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: /cart/i, level: 1 });
    this.items = page.getByRole("listitem");
  }

  item(title: string): Locator {
    return this.items.filter({
      has: this.page.getByText(title, { exact: true }),
    });
  }

  async remove(title: string): Promise<void> {
    await this.item(title)
      .getByRole("button", { name: /remove/i })
      .click();
  }
}
```

## Example — component object

```ts
import type { Locator, Page } from "@playwright/test";

export class AddedToCartDialog {
  readonly root: Locator;
  private readonly continueButton: Locator;
  private readonly goToCartButton: Locator;

  constructor(page: Page) {
    this.root = page.getByRole("alertdialog");
    this.continueButton = this.root.getByRole("button", {
      name: /continue shopping/i,
    });
    this.goToCartButton = this.root.getByRole("button", {
      name: /go to cart/i,
    });
  }

  async continueShopping(): Promise<void> {
    await this.continueButton.click();
  }

  async goToCart(): Promise<void> {
    await this.goToCartButton.click();
  }
}
```

## Example — test usage

```ts
// ✅ locator from the page object, web-first assertion in the test
await expect(cartPage.item(product.title)).toBeVisible();
await expect(page.getByRole("status")).toHaveText(/added/i); // toast — asserted in the test

// ❌ value getter — one-shot, defeats auto-waiting
expect(await cartPage.getItemCount()).toBe(1);
```

When a number is the behaviour (a total, a count badge), still assert the text: `toHaveText("2")`. Parse a value in the
test only when the assertion is a comparison no matcher expresses.
