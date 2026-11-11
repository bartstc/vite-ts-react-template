import type { Locator, Page } from "@playwright/test";

export class AddedToCartDialog {
  readonly root: Locator;
  private readonly continueButton: Locator;
  private readonly goToCartButton: Locator;

  constructor(page: Page) {
    this.root = page.getByRole("alertdialog", {
      name: /new product in the cart/i,
    });
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
