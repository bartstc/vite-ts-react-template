import { expect, type Locator, type Page } from "@playwright/test";

import { AddedToCartDialog } from "@e2e/pages/components/AddedToCartDialog";
import { HeaderComponent } from "@e2e/pages/components/HeaderComponent";

export class ProductDetailsPage {
  readonly header: HeaderComponent;
  readonly addedDialog: AddedToCartDialog;
  private readonly addToCartButton: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.addedDialog = new AddedToCartDialog(page);
    this.addToCartButton = page.getByRole("button", { name: /add to cart/i });
  }

  heading(name: string): Locator {
    return this.page.getByRole("heading", { name, exact: true });
  }

  async goto(id: string): Promise<void> {
    await this.page.goto(`/products/${id}`);
    await expect(this.addToCartButton).toBeVisible();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
