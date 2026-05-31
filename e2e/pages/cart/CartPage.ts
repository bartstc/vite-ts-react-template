import type { Page, Locator } from "@playwright/test";

import { BasePage } from "@e2e/pages/base/BasePage";

export class CartPage extends BasePage {
  readonly checkoutButton: Locator;
  readonly checkoutDialog: Locator;

  constructor(page: Page) {
    super(page);

    this.checkoutButton = page.getByRole("button", { name: /checkout/i });
    this.checkoutDialog = page.getByRole("alertdialog");
  }

  async goto(cartId: string): Promise<this> {
    await this.page.goto(`/cart/${cartId}`, { waitUntil: "networkidle" });
    return this;
  }

  async openCheckoutDialog(): Promise<this> {
    await this.checkoutButton.click();
    return this;
  }
}
