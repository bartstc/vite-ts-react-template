import type { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", {
      name: /list of selected products/i,
    });
  }

  item(name: string): Locator {
    return this.page.getByRole("article", { name, exact: true });
  }
}
