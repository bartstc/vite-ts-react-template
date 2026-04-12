import type { Page, Locator } from "@playwright/test";

import { BasePage } from "@e2e/pages/base/BasePage";
import { HeaderComponent } from "@e2e/pages/components/HeaderComponent";

export class ProductDetailsPage extends BasePage {
  readonly header: HeaderComponent;
  private readonly productDetailsSection: Locator;
  private readonly addToCartButton: Locator;
  private readonly backToListButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    this.productDetailsSection = page.locator(
      'section[data-testid="product-details"]'
    );

    this.addToCartButton = this.productDetailsSection.getByRole("button", {
      name: /add to cart/i,
    });

    this.backToListButton = this.productDetailsSection.getByRole("button", {
      name: /back to products.*list/i,
    });
  }

  private async goto(productId: string): Promise<this> {
    await this.page.goto(`/products/${productId}`, {
      waitUntil: "networkidle",
    });
    return this;
  }

  async gotoFirstProduct(): Promise<this> {
    // AIDEV-NOTE: Navigate via products list to avoid hardcoding ID format
    await this.page.goto("/products", { waitUntil: "networkidle" });
    await this.page.getByRole("article").first().getByRole("img").click();
    await this.page.waitForURL(/\/products\/.+/, { waitUntil: "networkidle" });
    return this;
  }

  async addToCart(): Promise<this> {
    await this.addToCartButton.click();
    return this;
  }

  async navigateBackToList(): Promise<void> {
    await this.backToListButton.click();
  }
}
