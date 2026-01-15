import type { Page, Locator } from "@playwright/test";

export class ProductCardComponent {
  private readonly addToCartButton: Locator;

  constructor(
    _page: Page,
    private root: Locator
  ) {
    // AIDEV-NOTE: Using semantic locators - no test IDs needed
    this.addToCartButton = root.getByRole("button", { name: /add to cart/i });
  }

  async click(): Promise<void> {
    // AIDEV-NOTE: Click the product card image area to navigate to product details
    // The Box with background image has onClick handler for navigation
    await this.root.locator("div").first().click();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
