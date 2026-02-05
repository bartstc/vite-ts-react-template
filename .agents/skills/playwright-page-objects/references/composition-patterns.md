# Composition Patterns

Composition and mixins have replaced deep inheritance hierarchies in modern Playwright architecture.

## Anti-Pattern: Deep Inheritance

```typescript
// ❌ BAD - Creates rigid, hard-to-modify hierarchies
class BasePage {}
class AuthenticatedPage extends BasePage {}
class AdminPage extends AuthenticatedPage {}
class AdminSettingsPage extends AdminPage {} // 4 levels deep!
```

## Recommended: Composition with Shared Components

```typescript
// ✅ GOOD - Compose behaviors from focused components
class ProductDetailsPage {
  readonly header: HeaderComponent;
  readonly breadcrumb: BreadcrumbComponent;
  readonly productInfo: ProductInfoSection;

  constructor(private page: Page) {
    this.header = new HeaderComponent(page);
    this.breadcrumb = new BreadcrumbComponent(page);
    this.productInfo = new ProductInfoSection(page);
  }

  async addToCart(): Promise<void> {
    await this.productInfo.addToCartButton.click();
  }
}
```

## Thin Base Class (When Needed)

Use a thin base class only for truly universal behaviors:

```typescript
// pages/base/BasePage.ts
import { Page, expect } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  // Only include genuinely universal methods here
}
```

## Component Example: ProductCardComponent

```typescript
// pages/components/ProductCardComponent.ts
import { Page, Locator } from "@playwright/test";

export class ProductCardComponent {
  readonly name: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;
  readonly image: Locator;

  constructor(
    private page: Page,
    private root: Locator
  ) {
    this.name = root.locator('[data-testid="product-name"]');
    this.price = root.locator('[data-testid="product-price"]');
    this.addToCartButton = root.getByRole("button", { name: "Add to Cart" });
    this.image = root.locator("img");
  }

  async click(): Promise<void> {
    await this.root.click();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async getName(): Promise<string> {
    return (await this.name.textContent()) || "";
  }

  async getPrice(): Promise<number> {
    const text = await this.price.textContent();
    return parseFloat(text?.replace(/[^0-9.]/g, "") || "0");
  }
}
```

## Using Components in Page Objects

```typescript
class ProductListPage extends BasePage {
  readonly productGrid: Locator;
  readonly filterComponent: FilterComponent;

  constructor(page: Page) {
    super(page);
    this.productGrid = page.locator('[data-testid="product-grid"]');
    this.filterComponent = new FilterComponent(page);
  }

  getProductCard(productName: string): ProductCardComponent {
    const cardLocator = this.productGrid
      .locator('[data-testid="product-card"]')
      .filter({ hasText: productName });
    return new ProductCardComponent(this.page, cardLocator);
  }

  async addProductToCart(productName: string): Promise<this> {
    const card = this.getProductCard(productName);
    await card.addToCart();
    return this;
  }
}
```

## Key Benefits

1. **Flexibility** — Components can be reused across different pages
2. **Testability** — Each component can be tested in isolation
3. **Maintainability** — Changes to shared UI only require updating one component
4. **Clarity** — Clear separation between page-level and component-level concerns
