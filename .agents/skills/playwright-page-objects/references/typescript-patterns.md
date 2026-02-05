# TypeScript Patterns

Type-safe patterns for building maintainable page objects.

## Readonly Properties for Immutable Locators

```typescript
export class SignInPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.submitButton = page.getByRole("button", { name: "Sign In" });
  }
}
```

## Generic Component Patterns

```typescript
// Generic table/list component
export class DataTable<TRow> {
  readonly page: Page;
  readonly rows: Locator;

  constructor(page: Page, containerSelector: string) {
    this.page = page;
    this.rows = page
      .locator(containerSelector)
      .locator('[data-testid="table-row"]');
  }

  async getRowCount(): Promise<number> {
    return await this.rows.count();
  }

  async getRowByText(text: string): Promise<Locator> {
    return this.rows.filter({ hasText: text });
  }

  async forEachRow(
    callback: (row: Locator, index: number) => Promise<void>
  ): Promise<void> {
    const count = await this.rows.count();
    for (let i = 0; i < count; i++) {
      await callback(this.rows.nth(i), i);
    }
  }
}
```

## Interface Definitions for Page Object Contracts

```typescript
// Enforce consistent page object structure
interface IPage {
  goto(): Promise<this>;
}

interface IAuthenticatedPage extends IPage {
  logout(): Promise<SignInPage>;
}

// Type-safe fixture definitions
type EcommerceFixtures = {
  signInPage: SignInPage;
  productListPage: ProductListPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  testUser: TestUser;
};
```

## Data Interfaces

```typescript
export interface ProductReview {
  name: string;
  email: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
}
```

## Return Types

### Fluent Interface (Same Page)

```typescript
async setQuantity(quantity: number): Promise<this> {
  await this.quantityInput.fill(String(quantity));
  return this;
}

async addToCart(): Promise<this> {
  await this.addToCartButton.click();
  return this;
}
```

### Navigation Return (Different Page)

```typescript
async selectProduct(productName: string): Promise<ProductDetailsPage> {
  const card = this.getProductCard(productName);
  await card.click();
  await this.page.waitForURL(/\/products\/\d+\/details/);
  return new ProductDetailsPage(this.page);
}

async addToCartAndGoToCart(): Promise<CartPage> {
  await this.addToCart();
  await this.page.getByRole("button", { name: "View Cart" }).click();
  return new CartPage(this.page);
}
```

## Private vs Public Members

```typescript
export class ProductDetailsPage extends BasePage {
  // Public - tests need to access for assertions
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;

  // Private - internal implementation detail
  private readonly loadingSpinner: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.getByTestId("product-title");
    this.productPrice = page.getByTestId("product-price");
    this.addToCartButton = page.getByRole("button", { name: "Add to Cart" });
    this.loadingSpinner = page.getByTestId("loading");
  }

  // Public - test actions
  async addToCart(): Promise<this> {
    await this.addToCartButton.click();
    await this.waitForCartUpdate();
    return this;
  }

  // Private - internal helper
  private async waitForCartUpdate(): Promise<void> {
    await this.loadingSpinner.waitFor({ state: "hidden" });
  }

  // Private - URL parsing utility
  private extractProductIdFromUrl(): string {
    const match = this.page.url().match(/\/products\/([^/]+)/);
    return match?.[1] || "";
  }
}
```

## Type Guards

```typescript
function isProductPage(page: BasePage): page is ProductDetailsPage {
  return page instanceof ProductDetailsPage;
}

function isCheckoutComplete(page: CheckoutPage): boolean {
  return page.confirmation !== undefined;
}
```

## Utility Types

```typescript
// Partial for optional method parameters
async fillShippingInfo(info: Partial<ShippingInfo>): Promise<this> {
  if (info.firstName) await this.firstNameInput.fill(info.firstName);
  if (info.lastName) await this.lastNameInput.fill(info.lastName);
  // ...
  return this;
}

// Pick for specific fields
type ShippingAddress = Pick<ShippingInfo, 'address' | 'city' | 'zipCode' | 'country'>;

// Omit for excluding fields
type ShippingWithoutCountry = Omit<ShippingInfo, 'country'>;
```
