import { expect, type Locator, type Page } from "@playwright/test";

import { AddedToCartDialog } from "@e2e/pages/components/AddedToCartDialog";
import { HeaderComponent } from "@e2e/pages/components/HeaderComponent";
import { ProductCardComponent } from "@e2e/pages/components/ProductCardComponent";

export class ProductListPage {
  readonly header: HeaderComponent;
  readonly heading: Locator;
  readonly addedDialog: AddedToCartDialog;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.heading = page.getByRole("heading", { name: /products list/i });
    this.addedDialog = new AddedToCartDialog(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("/products");
    await expect(this.heading).toBeVisible();
  }

  card(name: string): ProductCardComponent {
    return new ProductCardComponent(
      this.page.getByRole("article", { name, exact: true })
    );
  }
}
