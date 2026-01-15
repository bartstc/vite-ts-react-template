import type { Page, Locator } from "@playwright/test";

import { BasePage } from "@e2e/pages/base/BasePage";
import { HeaderComponent } from "@e2e/pages/components/HeaderComponent";
import { ProductCardComponent } from "@e2e/pages/components/ProductCardComponent";

export class ProductListPage extends BasePage {
  readonly header: HeaderComponent;
  private readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.searchInput = page.getByPlaceholder(/search/i);
  }

  async goto(): Promise<this> {
    await this.page.goto("/products", { waitUntil: "networkidle" });
    return this;
  }

  async waitForProductsToLoad(): Promise<void> {
    // AIDEV-NOTE: Wait for at least one "Add to cart" button to appear
    // This indicates products have loaded, without needing a test ID on the grid
    await this.page
      .getByRole("button", { name: /add to cart/i })
      .first()
      .waitFor({ state: "visible" });
  }

  async getProductCount(): Promise<number> {
    // AIDEV-NOTE: Count product cards by counting <article> elements
    // Each ProductCard renders as a semantic <article> element
    const cards = await this.page.locator("article").all();
    return cards.length;
  }

  private getProductCard(index = 0): ProductCardComponent {
    // AIDEV-NOTE: Get product card by index (default: first product)
    // E2E tests use real API data, so we can't rely on specific product names
    const cardRoot = this.page.locator("article").nth(index);

    return new ProductCardComponent(this.page, cardRoot);
  }

  async selectFirstProduct(): Promise<void> {
    const card = this.getProductCard(0);
    await card.click();
  }

  async addFirstProductToCart(): Promise<this> {
    const card = this.getProductCard(0);
    await card.addToCart();
    return this;
  }

  async selectProductByIndex(index: number): Promise<void> {
    const card = this.getProductCard(index);
    await card.click();
  }

  async addProductToCartByIndex(index: number): Promise<this> {
    const card = this.getProductCard(index);
    await card.addToCart();
    return this;
  }

  async searchFor(query: string): Promise<this> {
    await this.searchInput.fill(query);
    return this;
  }
}
