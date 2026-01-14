# Enterprise Playwright POM architecture for React e-commerce applications

**The fixtures pattern has emerged as Playwright's recommended approach** for page object management in 2024-2025, replacing traditional PageManager aggregation patterns. Modern POM architecture favors composition over inheritance, role-based locators over CSS selectors, and component-level page objects for reusable React elements. For your e-commerce domain, you'll need **5-6 page objects** plus **3-4 shared components**, with a clear separation between product listing, product details, cart, and checkout flows.

This guide synthesizes official Playwright documentation, TypeScript patterns, and real-world production examples to provide concrete, implementable patterns for your enterprise testing architecture.

---

## The fixtures pattern vs PageManager: a clear winner for scalability

Playwright's official documentation strongly recommends the **fixtures pattern** over traditional PageManager/aggregation approaches. The fixtures pattern provides automatic setup/teardown, on-demand instantiation, and superior type safety.

**Why fixtures beat PageManager:**

| Aspect                     | Fixtures Pattern               | PageManager Pattern          |
| -------------------------- | ------------------------------ | ---------------------------- |
| **Test isolation**         | Each test gets fresh instances | Shared state risks pollution |
| **Memory efficiency**      | Only instantiates needed POMs  | Often instantiates all POMs  |
| **TypeScript integration** | Native type inference          | Manual typing required       |
| **Parallel execution**     | Designed for parallelism       | Requires careful management  |
| **Setup/teardown**         | Encapsulated per fixture       | Global hooks complexity      |

**The recommended fixtures approach for your domain:**

```typescript
// fixtures/pageFixtures.ts
import { test as base } from "@playwright/test";
import { SignInPage } from "../pages/auth/SignInPage";
import { ProductListPage } from "../pages/products/ProductListPage";
import { ProductDetailsPage } from "../pages/products/ProductDetailsPage";
import { CartPage } from "../pages/cart/CartPage";
import { CheckoutPage } from "../pages/checkout/CheckoutPage";

type PageFixtures = {
  signInPage: SignInPage;
  productListPage: ProductListPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<PageFixtures>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  productListPage: async ({ page }, use) => {
    await use(new ProductListPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from "@playwright/test";
```

Tests then consume these fixtures with full type safety:

```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from "../fixtures/pageFixtures";

test("complete purchase flow", async ({
  productListPage,
  cartPage,
  checkoutPage,
}) => {
  await productListPage.goto();
  await productListPage.addProductToCart("Premium Headphones");
  await cartPage.proceedToCheckout();
  await checkoutPage.completeCheckout(shippingData, paymentData);

  await expect(checkoutPage.confirmationSection).toBeVisible();
});
```

---

## Composition beats inheritance every time

The mixin and composition patterns have replaced deep inheritance hierarchies in modern Playwright architecture. Rather than creating `BasePage → AuthenticatedPage → AdminPage` chains, compose behaviors from smaller, focused components.

**Anti-pattern: Deep inheritance (avoid)**

```typescript
// ❌ BAD - Creates rigid, hard-to-modify hierarchies
class BasePage {}
class AuthenticatedPage extends BasePage {}
class AdminPage extends AuthenticatedPage {}
class AdminSettingsPage extends AdminPage {} // 4 levels deep!
```

**Recommended pattern: Composition with shared components**

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

When you do need shared functionality, use a **thin base class** for truly universal behaviors:

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

---

## Your e-commerce page object architecture

Based on your routes, here's the recommended page object structure with component separation:

```
pages/
├── base/
│   └── BasePage.ts
├── auth/
│   └── SignInPage.ts              → /sign-in
├── products/
│   ├── ProductListPage.ts         → /products
│   ├── ProductDetailsPage.ts      → /products/:productId/details
│   └── ProductReviewsPage.ts      → /products/:productId/reviews/:reviewId
├── cart/
│   └── CartPage.ts                → /cart/:cartId
├── checkout/
│   └── CheckoutPage.ts            → checkout flow
└── components/
    ├── HeaderComponent.ts         → Reusable navigation
    ├── ProductCardComponent.ts    → Product grid items
    ├── FilterComponent.ts         → Search/filter sidebar
    └── ModalComponent.ts          → Confirmation dialogs
```

**Why separate ProductListPage from ProductDetailsPage?** These represent fundamentally different user interactions. The list page handles browsing, filtering, and selection. The details page handles product examination, quantity selection, and cart addition. Keeping them separate prevents "fat page objects" and enables targeted testing.

### ProductListPage implementation

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

### ProductDetailsPage with nested route handling

```typescript
// pages/products/ProductDetailsPage.ts
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { HeaderComponent } from "../components/HeaderComponent";

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

### Reusable ProductCardComponent

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

---

## Locator strategies: role-based selectors dominate

Playwright's official recommendation is clear: **prioritize `getByRole()` as your primary locator strategy**. This aligns with Kent C. Dodds' Testing Library philosophy and ensures your tests verify user-facing behavior.

**Locator priority order:**

1. **`page.getByRole()`** — Highest priority for interactive elements
2. **`page.getByLabel()`** — Best for form inputs with labels
3. **`page.getByText()`** — For non-interactive content
4. **`page.getByPlaceholder()`** — When labels aren't available
5. **`page.getByTestId()`** — Escape hatch when semantics fail

**Anti-pattern: Brittle CSS selectors**

```typescript
// ❌ BAD - Breaks when styling or DOM structure changes
await page
  .locator("#app > div.container > div.products > div:nth-child(2) > button")
  .click();
await page.locator(".btn-primary.add-to-cart").click();
```

**Recommended pattern: Semantic, resilient selectors**

```typescript
// ✅ GOOD - Survives refactoring, mirrors user perspective
await page.getByRole("button", { name: "Add to Cart" }).click();
await page
  .getByRole("listitem")
  .filter({ hasText: "Premium Headphones" })
  .getByRole("button", { name: "Add to Cart" })
  .click();
```

**When to use data-testid:**

```typescript
// Use data-testid when there's no semantic alternative
readonly cartBadge = page.getByTestId('cart-item-count');
readonly productGrid = page.getByTestId('product-grid');

// Configure custom attribute in playwright.config.ts if needed
export default defineConfig({
  use: {
    testIdAttribute: 'data-pw',  // Custom attribute
  },
});
```

---

## Handling forms and multi-step checkout flows

Your checkout flow spans multiple steps, requiring careful method design. Use **fluent interfaces** (returning `this`) for chainable operations and **explicit navigation returns** when changing pages.

```typescript
// pages/checkout/CheckoutPage.ts
import { Page, Locator, expect } from "@playwright/test";

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

export class CheckoutPage {
  readonly shippingForm: Locator;
  readonly paymentForm: Locator;
  readonly orderReview: Locator;
  readonly confirmation: Locator;

  constructor(private page: Page) {
    this.shippingForm = page.getByTestId("shipping-form");
    this.paymentForm = page.getByTestId("payment-form");
    this.orderReview = page.getByTestId("order-review");
    this.confirmation = page.getByTestId("order-confirmation");
  }

  // Step 1: Shipping
  async fillShippingInfo(info: ShippingInfo): Promise<this> {
    await this.shippingForm.getByLabel("First Name").fill(info.firstName);
    await this.shippingForm.getByLabel("Last Name").fill(info.lastName);
    await this.shippingForm.getByLabel("Address").fill(info.address);
    await this.shippingForm.getByLabel("City").fill(info.city);
    await this.shippingForm.getByLabel("Zip Code").fill(info.zipCode);
    await this.shippingForm
      .getByRole("combobox", { name: "Country" })
      .selectOption(info.country);
    return this;
  }

  async proceedToPayment(): Promise<this> {
    await this.page
      .getByRole("button", { name: "Continue to Payment" })
      .click();
    await expect(this.paymentForm).toBeVisible();
    return this;
  }

  // Step 2: Payment
  async fillPaymentInfo(info: PaymentInfo): Promise<this> {
    await this.paymentForm.getByLabel("Card Number").fill(info.cardNumber);
    await this.paymentForm.getByLabel("Expiry").fill(info.expiry);
    await this.paymentForm.getByLabel("CVV").fill(info.cvv);
    await this.paymentForm.getByLabel("Name on Card").fill(info.nameOnCard);
    return this;
  }

  async proceedToReview(): Promise<this> {
    await this.page.getByRole("button", { name: "Review Order" }).click();
    await expect(this.orderReview).toBeVisible();
    return this;
  }

  // Step 3: Confirm
  async placeOrder(): Promise<this> {
    await this.page.getByRole("button", { name: "Place Order" }).click();
    await expect(this.confirmation).toBeVisible();
    return this;
  }

  async getOrderNumber(): Promise<string> {
    return (
      (await this.confirmation.getByTestId("order-number").textContent()) || ""
    );
  }

  // High-level flow for full E2E tests
  async completeCheckout(
    shipping: ShippingInfo,
    payment: PaymentInfo
  ): Promise<string> {
    await this.fillShippingInfo(shipping);
    await this.proceedToPayment();
    await this.fillPaymentInfo(payment);
    await this.proceedToReview();
    await this.placeOrder();
    return this.getOrderNumber();
  }
}
```

---

## TypeScript patterns for type-safe page objects

### Readonly properties for immutable locators

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

### Generic component patterns for reusable elements

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

### Interface definitions for page object contracts

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

---

## Where assertions belong: tests, not page objects

The expert consensus is clear: **assertions belong in test files**, not page objects. Page objects should expose state and perform actions, while tests make assertions about that state.

**Anti-pattern: Assertions buried in page objects**

```typescript
// ❌ BAD - Test logic hidden in page object
class CartPage {
  async verifyItemInCart(productName: string): Promise<void> {
    await expect(this.cartItems).toContainText(productName); // Hidden assertion
    await expect(this.cartTotal).toBeVisible(); // More hidden assertions
  }
}
```

**Recommended pattern: Page objects expose, tests assert**

```typescript
// ✅ GOOD - Page object exposes state
class CartPage {
  async getCartItemNames(): Promise<string[]> {
    const items = await this.cartItems.allTextContents();
    return items;
  }

  async getCartTotal(): Promise<number> {
    const text = await this.cartTotal.textContent();
    return parseFloat(text?.replace(/[^0-9.]/g, "") || "0");
  }
}

// Test makes assertions
test("product appears in cart after adding", async ({
  productListPage,
  cartPage,
}) => {
  await productListPage.addProductToCart("Premium Headphones");
  await cartPage.goto();

  const items = await cartPage.getCartItemNames();
  expect(items).toContain("Premium Headphones"); // Assertion in test
});
```

**Exception: Validation assertions during navigation** are acceptable when they verify state transitions:

```typescript
async proceedToPayment(): Promise<this> {
  await this.page.getByRole('button', { name: 'Continue' }).click();
  await expect(this.paymentForm).toBeVisible();  // Acceptable: verifies navigation completed
  return this;
}
```

---

## Authentication patterns for parallel test execution

Use Playwright's **setup project pattern** to authenticate once and share state across tests:

```typescript
// auth.setup.ts
import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(process.env.TEST_USER!);
  await page.getByLabel("Password").fill(process.env.TEST_PASSWORD!);
  await page.getByRole("button", { name: "Sign In" }).click();

  await page.waitForURL("/products");
  await page.context().storageState({ path: authFile });
});

// playwright.config.ts
export default defineConfig({
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      use: { storageState: "playwright/.auth/user.json" },
      dependencies: ["setup"],
    },
  ],
});
```

**Critical:** Add `playwright/.auth/` to your `.gitignore` — storage state contains sensitive session data.

---

## Test data management with factories

```typescript
// factories/CheckoutDataFactory.ts
import { faker } from "@faker-js/faker";
import type { ShippingInfo, PaymentInfo } from "../pages/checkout/CheckoutPage";

export class CheckoutDataFactory {
  static createShipping(overrides: Partial<ShippingInfo> = {}): ShippingInfo {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      zipCode: faker.location.zipCode(),
      country: "US",
      ...overrides,
    };
  }

  static createPayment(overrides: Partial<PaymentInfo> = {}): PaymentInfo {
    return {
      cardNumber: "4111111111111111", // Test card
      expiry: "12/28",
      cvv: "123",
      nameOnCard: faker.person.fullName(),
      ...overrides,
    };
  }
}

// Usage in tests
test("complete checkout", async ({ checkoutPage }) => {
  const shipping = CheckoutDataFactory.createShipping({ country: "CA" });
  const payment = CheckoutDataFactory.createPayment();

  await checkoutPage.completeCheckout(shipping, payment);
});
```

---

## Five anti-patterns that kill maintainability

**1. Fat page objects** — Classes with 50+ locators and 20+ methods. Split into focused components.

**2. Tight coupling** — Tests that access locators directly (`loginPage.usernameField.fill()`). Use semantic methods (`loginPage.login(user, pass)`).

**3. Deep inheritance** — Multiple levels of base classes. Use composition and mixins instead.

**4. Wrapping Playwright API** — Creating `click()` or `fill()` wrapper methods. Just use Playwright directly.

**5. Assertions in page objects** — Hide test logic. Keep assertions in test files where they're visible.

---

## Folder structure for enterprise scale

```
playwright-e2e/
├── pages/
│   ├── base/
│   │   └── BasePage.ts
│   ├── auth/
│   │   └── SignInPage.ts
│   ├── products/
│   │   ├── ProductListPage.ts
│   │   ├── ProductDetailsPage.ts
│   │   └── ProductReviewsPage.ts
│   ├── cart/
│   │   └── CartPage.ts
│   ├── checkout/
│   │   └── CheckoutPage.ts
│   └── components/
│       ├── HeaderComponent.ts
│       ├── ProductCardComponent.ts
│       ├── FilterComponent.ts
│       └── ModalComponent.ts
├── fixtures/
│   ├── pageFixtures.ts
│   └── auth.setup.ts
├── factories/
│   ├── UserFactory.ts
│   ├── ProductFactory.ts
│   └── CheckoutDataFactory.ts
├── tests/
│   ├── e2e/
│   │   ├── auth/
│   │   │   └── sign-in.spec.ts
│   │   ├── products/
│   │   │   ├── browse-products.spec.ts
│   │   │   └── product-details.spec.ts
│   │   ├── cart/
│   │   │   └── cart-management.spec.ts
│   │   └── checkout/
│   │       └── purchase-flow.spec.ts
│   └── smoke/
│       └── critical-paths.spec.ts
├── playwright.config.ts
└── tsconfig.json
```

---

## Conclusion

The fixtures pattern, composition-based architecture, and role-based selectors form the foundation of modern Playwright POM design. For your e-commerce domain:

- **Create separate page objects** for ProductListPage and ProductDetailsPage — they serve distinct user workflows
- **Extract shared elements** (header, product cards, filters) into component objects that compose into pages
- **Handle nested routes** by including navigation methods that construct URLs from dynamic parameters
- **Use fixtures** for dependency injection, avoiding PageManager anti-patterns
- **Keep assertions in tests** while allowing navigation verification in page objects
- **Leverage TypeScript** with readonly locators, interfaces, and generic components

This architecture scales to hundreds of tests while remaining maintainable, parallel-execution friendly, and aligned with modern testing philosophy from Kent C. Dodds and the Playwright team.
