# Page Implementations

Concrete examples for an e-commerce domain with separate page objects for distinct user workflows.

## Why Separate ProductListPage from ProductDetailsPage?

These represent fundamentally different user interactions:

- **List page** — Browsing, filtering, selection
- **Details page** — Examination, quantity selection, cart addition

Keeping them separate prevents "fat page objects" and enables targeted testing.

## ProductListPage

```typescript
// pages/products/ProductListPage.ts
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { ProductDetailsPage } from "./ProductDetailsPage";
import { FilterComponent } from "../components/FilterComponent";
import { ProductCardComponent } from "../components/ProductCardComponent";

export class ProductListPage extends BasePage {
  readonly productGrid: Locator;
  readonly searchInput: Locator;
  readonly filterComponent: FilterComponent;

  constructor(page: Page) {
    super(page);
    this.productGrid = page.locator('[data-testid="product-grid"]');
    this.searchInput = page.getByPlaceholder("Search products...");
    this.filterComponent = new FilterComponent(page);
  }

  async goto(): Promise<this> {
    await this.page.goto("/products");
    return this;
  }

  async getProductCount(): Promise<number> {
    return await this.productGrid
      .locator('[data-testid="product-card"]')
      .count();
  }

  getProductCard(productName: string): ProductCardComponent {
    const cardLocator = this.productGrid
      .locator('[data-testid="product-card"]')
      .filter({ hasText: productName });
    return new ProductCardComponent(this.page, cardLocator);
  }

  async selectProduct(productName: string): Promise<ProductDetailsPage> {
    const card = this.getProductCard(productName);
    await card.click();
    await this.page.waitForURL(/\/products\/\d+\/details/);
    return new ProductDetailsPage(this.page);
  }

  async addProductToCart(productName: string): Promise<this> {
    const card = this.getProductCard(productName);
    await card.addToCart();
    return this;
  }

  async searchFor(query: string): Promise<this> {
    await this.searchInput.fill(query);
    await this.searchInput.press("Enter");
    return this;
  }
}
```

## ProductDetailsPage

```typescript
// pages/products/ProductDetailsPage.ts
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { HeaderComponent } from "../components/HeaderComponent";
import { CartPage } from "../cart/CartPage";

export interface ProductReview {
  name: string;
  email: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
}

export class ProductDetailsPage extends BasePage {
  readonly header: HeaderComponent;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInput: Locator;
  readonly reviewsSection: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.productTitle = page.getByTestId("product-title");
    this.productPrice = page.getByTestId("product-price");
    this.addToCartButton = page.getByRole("button", { name: "Add to Cart" });
    this.quantityInput = page.getByLabel("Quantity");
    this.reviewsSection = page.locator('[data-testid="reviews-section"]');
  }

  async gotoProduct(productId: string): Promise<this> {
    await this.page.goto(`/products/${productId}/details`);
    return this;
  }

  async setQuantity(quantity: number): Promise<this> {
    await this.quantityInput.fill(String(quantity));
    return this;
  }

  async addToCart(): Promise<this> {
    await this.addToCartButton.click();
    return this;
  }

  async addToCartAndContinue(): Promise<this> {
    await this.addToCart();
    await this.page.getByRole("button", { name: "Continue Shopping" }).click();
    return this;
  }

  async addToCartAndGoToCart(): Promise<CartPage> {
    await this.addToCart();
    await this.page.getByRole("button", { name: "View Cart" }).click();
    return new CartPage(this.page);
  }

  // Nested route: /products/:productId/reviews/:reviewId
  async navigateToReview(reviewId: string): Promise<void> {
    const productId = this.extractProductIdFromUrl();
    await this.page.goto(`/products/${productId}/reviews/${reviewId}`);
  }

  async submitReview(review: ProductReview): Promise<this> {
    await this.reviewsSection.getByLabel("Name").fill(review.name);
    await this.reviewsSection.getByLabel("Email").fill(review.email);
    await this.reviewsSection
      .getByRole("radio", { name: `${review.rating} stars` })
      .check();
    await this.reviewsSection.getByLabel("Comment").fill(review.comment);
    await this.reviewsSection
      .getByRole("button", { name: "Submit Review" })
      .click();
    return this;
  }

  private extractProductIdFromUrl(): string {
    const match = this.page.url().match(/\/products\/([^/]+)/);
    return match?.[1] || "";
  }
}
```

## CartPage

```typescript
// pages/cart/CartPage.ts
import { Page, Locator } from "@playwright/test";
import { BasePage } from "../base/BasePage";

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartTotal: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-testid="cart-item"]');
    this.cartTotal = page.getByTestId("cart-total");
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    this.emptyCartMessage = page.getByText("Your cart is empty");
  }

  async goto(): Promise<this> {
    await this.page.goto("/cart");
    return this;
  }

  async getCartItemNames(): Promise<string[]> {
    const items = await this.cartItems.allTextContents();
    return items;
  }

  async getCartTotal(): Promise<number> {
    const text = await this.cartTotal.textContent();
    return parseFloat(text?.replace(/[^0-9.]/g, "") || "0");
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async removeItem(productName: string): Promise<this> {
    await this.cartItems
      .filter({ hasText: productName })
      .getByRole("button", { name: "Remove" })
      .click();
    return this;
  }

  async updateQuantity(productName: string, quantity: number): Promise<this> {
    await this.cartItems
      .filter({ hasText: productName })
      .getByLabel("Quantity")
      .fill(String(quantity));
    return this;
  }
}
```

## Key Patterns

1. **Fluent interface** — Methods return `this` for chaining
2. **Navigation returns** — Methods that navigate return the target page object
3. **Composed components** — Reusable UI elements as component objects
4. **Private helpers** — Internal utilities marked private
5. **Typed interfaces** — Data structures for complex inputs
