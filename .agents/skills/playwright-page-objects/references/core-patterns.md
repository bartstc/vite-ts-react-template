# Core Patterns

Essential patterns for building maintainable Playwright page objects.

## Basic Page Object Pattern

Page objects encapsulate page structure and expose state via getters. Tests make assertions.

```typescript
import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.errorMessage = page.getByRole("alert");
  }

  async goto(): Promise<this> {
    await this.page.goto("/login");
    return this;
  }

  async login(email: string, password: string): Promise<this> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    return this;
  }

  // Expose state via getters — tests make assertions
  async getErrorMessage(): Promise<string | null> {
    return await this.errorMessage.textContent();
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}
```

### Test Usage

```typescript
import { test, expect } from "../pages";

test("should show error on invalid credentials", async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login("user@example.com", "wrongpassword");

  // Assertions belong in tests, NOT in page objects
  const error = await loginPage.getErrorMessage();
  expect(error).toContain("Invalid credentials");
});

test("should login successfully", async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login("user@example.com", "password123");

  await expect(page).toHaveURL("/dashboard");
});
```

## Locator Strategies

### Priority Order

```typescript
// 1. Role-based (preferred for interactive elements)
page.getByRole("button", { name: "Submit" });
page.getByRole("link", { name: "View Details" });
page.getByRole("checkbox", { name: "Remember me" });
page.getByRole("combobox", { name: "Country" });

// 2. Label-based (form inputs)
page.getByLabel("Email");
page.getByLabel("Password");

// 3. Text-based (non-interactive content)
page.getByText("Welcome back");

// 4. Placeholder (when no label available)
page.getByPlaceholder("Search products...");

// 5. Test ID (escape hatch when semantics fail)
page.getByTestId("cart-item-count");
page.getByTestId("loading-spinner");
```

### Filtering and Chaining

```typescript
// Filter by text content
page.getByRole("listitem").filter({ hasText: "Premium Headphones" });

// Chain locators for specificity
page
  .getByTestId("product-card")
  .filter({ hasText: "Headphones" })
  .getByRole("button", { name: "Add to Cart" });

// Get nth element
page.getByRole("listitem").nth(0);
page.getByRole("listitem").first();
page.getByRole("listitem").last();
```

## Composition Patterns

### Component-Based Architecture

```typescript
// components/ProductCardComponent.ts
export class ProductCardComponent {
  readonly name: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;

  constructor(
    private page: Page,
    private root: Locator
  ) {
    this.name = root.getByTestId("product-name");
    this.price = root.getByTestId("product-price");
    this.addToCartButton = root.getByRole("button", { name: "Add to Cart" });
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

### Composing Page Objects

```typescript
// pages/ProductListPage.ts
export class ProductListPage {
  readonly page: Page;
  readonly productGrid: Locator;
  readonly searchInput: Locator;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.productGrid = page.getByTestId("product-grid");
    this.searchInput = page.getByPlaceholder("Search products...");
    this.header = new HeaderComponent(page);
  }

  async goto(): Promise<this> {
    await this.page.goto("/products");
    return this;
  }

  getProductCard(productName: string): ProductCardComponent {
    const cardLocator = this.productGrid
      .getByTestId("product-card")
      .filter({ hasText: productName });
    return new ProductCardComponent(this.page, cardLocator);
  }

  async addProductToCart(productName: string): Promise<this> {
    const card = this.getProductCard(productName);
    await card.addToCart();
    return this;
  }

  async selectProduct(productName: string): Promise<ProductDetailsPage> {
    const card = this.getProductCard(productName);
    await card.click();
    await this.page.waitForURL(/\/products\/\d+\/details/);
    return new ProductDetailsPage(this.page);
  }
}
```

### Thin Base Class (When Needed)

Only for truly universal behaviors:

```typescript
export class BasePage {
  constructor(protected page: Page) {}

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
```

## Waiting Strategies

### Wait for Page Load

```typescript
export class DashboardPage {
  readonly page: Page;
  private readonly loadingSpinner: Locator;
  readonly dataTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.getByTestId("loading-spinner");
    this.dataTable = page.getByRole("table");
  }

  async goto(): Promise<this> {
    await this.page.goto("/dashboard");
    await this.waitForPageLoad();
    return this;
  }

  private async waitForPageLoad(): Promise<void> {
    // Wait for loading spinner to disappear
    await this.loadingSpinner.waitFor({ state: "hidden" });

    // Wait for content to appear
    await this.dataTable.waitFor({ state: "visible" });

    // Optionally wait for network idle
    await this.page.waitForLoadState("networkidle");
  }
}
```

### Wait for API Response

```typescript
export class ProductDetailsPage {
  readonly page: Page;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByRole("button", { name: "Add to Cart" });
  }

  async addToCart(): Promise<this> {
    await this.addToCartButton.click();

    // Wait for cart API response
    await this.page.waitForResponse(
      (response) =>
        response.url().includes("/api/cart") && response.status() === 200
    );

    return this;
  }
}
```

### Refresh Data Pattern

```typescript
export class DashboardPage {
  readonly page: Page;
  private readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.getByTestId("loading-spinner");
  }

  async refreshData(): Promise<this> {
    const refreshButton = this.page.getByRole("button", { name: "Refresh" });
    await refreshButton.click();

    // Wait for API response
    await this.page.waitForResponse(
      (response) =>
        response.url().includes("/api/dashboard") && response.status() === 200
    );

    // Wait for UI to update
    await this.loadingSpinner.waitFor({ state: "hidden" });

    return this;
  }
}
```

## High-Level Actions

For complex multi-page user flows, create an AppActions class:

```typescript
// pages/AppActions.ts
import { Page } from "@playwright/test";
import { LoginPage } from "./auth/LoginPage";
import { ProductListPage } from "./products/ProductListPage";
import { CartPage } from "./cart/CartPage";
import { CheckoutPage } from "./checkout/CheckoutPage";

export interface CheckoutData {
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
  };
  payment: {
    cardNumber: string;
    expiry: string;
    cvv: string;
  };
}

export class AppActions {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async login(email: string, password: string): Promise<void> {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login(email, password);
    await this.page.waitForURL("/dashboard");
  }

  async addProductToCart(productName: string): Promise<void> {
    const productListPage = new ProductListPage(this.page);
    await productListPage.goto();
    await productListPage.addProductToCart(productName);
  }

  async completeCheckout(data: CheckoutData): Promise<string> {
    const checkoutPage = new CheckoutPage(this.page);
    await this.page.goto("/checkout");

    await checkoutPage.fillShippingInfo(data.shipping);
    await checkoutPage.proceedToPayment();
    await checkoutPage.fillPaymentInfo(data.payment);
    await checkoutPage.proceedToReview();
    await checkoutPage.placeOrder();

    return checkoutPage.getOrderNumber();
  }
}
```

### Using AppActions in Tests

```typescript
import { test, expect } from "@playwright/test";
import { AppActions } from "../pages/AppActions";

test("complete purchase flow", async ({ page }) => {
  const app = new AppActions(page);

  await app.login("user@example.com", "password123");
  await app.addProductToCart("Premium Headphones");

  const orderNumber = await app.completeCheckout({
    shipping: {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "New York",
      zipCode: "10001",
    },
    payment: {
      cardNumber: "4111111111111111",
      expiry: "12/25",
      cvv: "123",
    },
  });

  expect(orderNumber).toBeTruthy();
  await expect(page.getByText("Order confirmed")).toBeVisible();
});
```

### AppActions as Fixture

```typescript
// pages/index.ts
import { test as base } from "@playwright/test";
import { AppActions } from "./AppActions";

type Fixtures = {
  app: AppActions;
  // ... other page fixtures
};

export const test = base.extend<Fixtures>({
  app: async ({ page }, use) => {
    await use(new AppActions(page));
  },
});
```

```typescript
// Usage with fixture
test("complete purchase flow", async ({ app, page }) => {
  await app.login("user@example.com", "password123");
  await app.addProductToCart("Premium Headphones");
  // ...
});
```
