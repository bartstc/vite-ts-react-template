import type { Page, Locator } from "@playwright/test";

export class ProductCardComponent {
  private readonly addToCartButton: Locator;

  constructor(
    _page: Page,
    private root: Locator
  ) {
    this.addToCartButton = root.getByRole("button", { name: /add to cart/i });
  }

  async click(): Promise<void> {
    await this.root.getByRole("img").click();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
