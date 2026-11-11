import type { Locator } from "@playwright/test";

export class ProductCardComponent {
  private readonly image: Locator;
  private readonly addToCartButton: Locator;

  constructor(readonly root: Locator) {
    this.image = root.getByRole("img");
    this.addToCartButton = root.getByRole("button", { name: /add to cart/i });
  }

  async open(): Promise<void> {
    await this.image.click();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
