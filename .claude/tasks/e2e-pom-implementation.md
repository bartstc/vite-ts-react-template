# E2E Test Suite Implementation with Page Object Model

## Overview

Refactor existing sign-in tests and implement comprehensive e2e test coverage using Playwright's fixtures pattern and Page Object Model best practices.

## Current State

- ✅ Basic sign-in test exists at `e2e/sign-in.spec.ts`
- ✅ Playwright configured (not using MSW for E2E)
- ✅ Domain fixtures exist in `@/test-lib/fixtures` (shared with unit tests)
- ✅ Already written comprehensive tests in Storybook (selectors, test cases etc)
- ❌ No Page Object Model structure
- ❌ Tests use direct locators (tightly coupled)
- ❌ No test coverage for products, cart, or other features
- ❌ No reusable components or Playwright fixtures

## Goals

1. Implement POM architecture using fixtures pattern (not PageManager)
2. Refactor existing sign-in tests to use SignInPage
3. Add comprehensive test coverage for products and cart features
4. Create reusable component objects for shared UI elements
5. **Reuse domain fixtures from `@/test-lib/fixtures` for test data** (no duplication)
6. Create E2E-specific credential fixtures only when needed
7. Maintain role-based locators (getByRole, getByLabel priority)

---

## Architecture Plan

### Directory Structure

```
e2e/
├── pages/
│   ├── base/
│   │   └── BasePage.ts                    # Thin base class for universal behaviors
│   ├── auth/
│   │   └── SignInPage.ts                  # /sign-in
│   ├── products/
│   │   ├── ProductListPage.ts             # /products
│   │   └── ProductDetailsPage.ts          # /products/:productId/details
│   ├── cart/
│   │   └── CartPage.ts                    # /cart/:cartId
│   └── components/
│   |   ├── HeaderComponent.ts             # Navigation, cart badge, logout
│   |   └── ProductCardComponent.ts        # Reusable product card
│   ├── pageFixtures.ts                    # Playwright fixtures for POM + domain data
├── fixtures/
│   └── credentialFixtures.ts              # E2E-specific: user credentials (password)
└── tests/
    ├── auth/
    │   └── sign-in.spec.ts                # Refactored with SignInPage
    ├── products/
    │   ├── product-list.spec.ts           # Browse, filter, add to cart
    │   └── product-details.spec.ts        # View details, quantity, add to cart
    └── cart/
        └── cart.spec.ts                   # View cart, update quantity, remove items

# Domain fixtures (shared with unit tests)
src/test-lib/fixtures/
├── createFixture.ts                       # ✅ Already exists - fixture factory utility
├── UserFixture.ts                         # ✅ Reuse for user domain data
├── ProductFixture.ts                      # ✅ Reuse for product domain data
└── CartFixture.ts                         # ✅ Reuse for cart domain data (if exists)
```

### Key Architectural Decisions

1. **Reuse domain fixtures**: Import from `@/test-lib/fixtures` instead of duplicating
2. **E2E-specific fixtures only**: Create `credentialFixtures.ts` for passwords (not in domain model)
3. **Fixtures pattern**: Playwright fixtures for dependency injection (not PageManager)
4. **Composition over inheritance**: HeaderComponent composed into pages
5. **Role-based locators**: Follow priority order (getByRole > getByLabel > getByTestId)

---

## Implementation Steps

### Phase 1: Foundation (Page Objects & Fixtures)

#### 1.1 Create BasePage

**File**: `e2e/pages/base/BasePage.ts`

**Purpose**: Thin base class for truly universal behaviors only

**Methods**:

- `constructor(protected page: Page)`
- `async waitForPageLoad(): Promise<void>` - Wait for networkidle
- `async getCurrentUrl(): Promise<string>` - Get current URL

**Notes**:

- Keep minimal - only genuinely universal methods
- All page objects will extend this

---

#### 1.2 Create HeaderComponent

**File**: `e2e/pages/components/HeaderComponent.ts`

**Purpose**: Shared navigation, cart badge, logout button

**Locators**:

- `readonly signInLink: Locator` - getByRole('link', { name: /sign in/i })
- `readonly logoutButton: Locator` - getByRole('button', { name: /logout/i })
- `readonly productsLink: Locator` - getByRole('link', { name: /products/i })
- `readonly cartBadge: Locator` - getByTestId('cart-badge') or similar
- `readonly cartLink: Locator` - getByRole('link', { name: /cart/i })

**Methods**:

- `async navigateToSignIn(): Promise<void>` - Click sign in link
- `async navigateToProducts(): Promise<void>` - Click products link
- `async navigateToCart(): Promise<void>` - Click cart link
- `async logout(): Promise<void>` - Click logout button
- `async getCartItemCount(): Promise<number>` - Get cart badge count (parses text content)
- `async isLoggedIn(): Promise<boolean>` - Complex check: logout visible AND signIn hidden (acceptable helper with logic)

**Notes**:

- Use composition - include in page objects that need it
- **Expose locators for simple visibility checks** - tests assert directly on exposed locators
- **`isLoggedIn()` is acceptable** - it combines multiple conditional checks (logout visible AND signIn hidden), not just wrapping `.isVisible()`

---

#### 1.3 Create SignInPage

**File**: `e2e/pages/auth/SignInPage.ts`

**Purpose**: Handle sign-in form interactions

**Locators**:

- `readonly usernameInput: Locator` - getByLabel(/username/i)
- `readonly passwordInput: Locator` - getByLabel(/password/i)
- `readonly signInButton: Locator` - getByRole('button', { name: /sign in/i })
- `readonly errorMessage: Locator` - getByText(/failed to sign in/i) or getByRole('alert')
- `readonly successMessage: Locator` - getByText(/successfully signed in/i)

**Methods**:

- `async goto(): Promise<this>` - Navigate to /sign-in
- `async fillUsername(username: string): Promise<this>` - Fill username (fluent)
- `async fillPassword(password: string): Promise<this>` - Fill password (fluent)
- `async clickSignIn(): Promise<void>` - Click sign in button
- `async login(username: string, password: string): Promise<void>` - High-level login

**Notes**:

- Extends BasePage
- Return `this` for chainable methods (fluent interface)
- Don't include HeaderComponent (sign-in page might not have full header)
- **Expose locators, don't wrap visibility checks** - tests assert directly on `successMessage` and `errorMessage` locators

---

#### 1.4 Create ProductCardComponent

**File**: `e2e/pages/components/ProductCardComponent.ts`

**Purpose**: Reusable product card in grid/list views

**Constructor**: `constructor(private page: Page, private root: Locator)`

**Locators** (relative to root):

- `readonly name: Locator` - root.getByTestId('product-name') or semantic selector
- `readonly price: Locator` - root.getByTestId('product-price')
- `readonly image: Locator` - root.locator('img')
- `readonly addToCartButton: Locator` - root.getByRole('button', { name: /add to cart/i })

**Methods**:

- `async click(): Promise<void>` - Click card to view details
- `async addToCart(): Promise<void>` - Click add to cart button
- `async getName(): Promise<string>` - Get product name
- `async getPrice(): Promise<number>` - Parse and return price as number

**Notes**:

- Takes root locator in constructor (scoped to specific card)
- No page navigation - just interactions within the card
- Return primitive types for assertions in tests

---

#### 1.5 Create ProductListPage

**File**: `e2e/pages/products/ProductListPage.ts`

**Purpose**: Browse and interact with product catalog

**Composition**:

- `readonly header: HeaderComponent` - Include header for navigation

**Locators**:

- `readonly productGrid: Locator` - getByTestId('product-grid') or semantic
- `readonly searchInput: Locator` - getByPlaceholder('Search...') or getByLabel('Search')
- Individual cards accessed via getProductCard() method

**Methods**:

- `async goto(): Promise<this>` - Navigate to /products
- `async getProductCount(): Promise<number>` - Count product cards
- `getProductCard(productName: string): ProductCardComponent` - Get specific card by name
- `async selectProduct(productName: string): Promise<ProductDetailsPage>` - Click card, return details page
- `async addProductToCart(productName: string): Promise<this>` - Add from grid (fluent)
- `async searchFor(query: string): Promise<this>` - Search products (if implemented)
- `async waitForProductsToLoad(): Promise<void>` - Wait for grid to be visible

**Notes**:

- Extends BasePage
- Composes HeaderComponent
- Returns ProductDetailsPage when navigating to details
- Use filter() to find specific product cards

---

#### 1.6 Create ProductDetailsPage

**File**: `e2e/pages/products/ProductDetailsPage.ts`

**Purpose**: View and interact with product details

**Composition**:

- `readonly header: HeaderComponent`

**Locators**:

- `readonly productTitle: Locator` - getByRole('heading', { level: 1 }) or getByTestId
- `readonly productPrice: Locator` - getByTestId('product-price')
- `readonly productDescription: Locator` - getByTestId('product-description')
- `readonly quantityInput: Locator` - getByLabel(/quantity/i)
- `readonly addToCartButton: Locator` - getByRole('button', { name: /add to cart/i })
- `readonly backButton: Locator` - getByRole('link', { name: /back/i }) or similar

**Methods**:

- `async goto(productId: string): Promise<this>` - Navigate to /products/:id/details
- `async getProductTitle(): Promise<string>` - Get product name
- `async getProductPrice(): Promise<number>` - Parse and return price
- `async setQuantity(quantity: number): Promise<this>` - Set quantity (fluent)
- `async addToCart(): Promise<this>` - Click add to cart (fluent)
- `async addToCartWithQuantity(quantity: number): Promise<this>` - High-level method
- `async navigateBack(): Promise<ProductListPage>` - Go back to list

**Notes**:

- Handle dynamic productId in route
- Extract productId from URL if needed: `private extractProductIdFromUrl()`
- Consider success message/toast handling

---

#### 1.7 Create CartPage

**File**: `e2e/pages/cart/CartPage.ts`

**Purpose**: View and manage cart contents

**Composition**:

- `readonly header: HeaderComponent`

**Locators**:

- `readonly cartItems: Locator` - getByTestId('cart-items') or semantic list
- `readonly emptyCartMessage: Locator` - getByText(/empty/i) or getByTestId
- `readonly cartTotal: Locator` - getByTestId('cart-total')
- `readonly checkoutButton: Locator` - getByRole('button', { name: /checkout/i })

**Methods**:

- `async goto(cartId: string): Promise<this>` - Navigate to /cart/:cartId
- `async getCartItemCount(): Promise<number>` - Count items in cart (complex: counts elements)
- `async getCartItemNames(): Promise<string[]>` - Get all product names (extracts data for assertions)
- `async getCartTotal(): Promise<number>` - Parse total price (extracts data for assertions)
- `async isCartEmpty(): Promise<boolean>` - Complex check: item count === 0 OR empty message visible (acceptable helper with logic)
- `async updateQuantity(productName: string, quantity: number): Promise<this>` - Update item quantity
- `async removeItem(productName: string): Promise<this>` - Remove item from cart
- `async clearCart(): Promise<this>` - Remove all items (if supported)
- `getCartItem(productName: string): Locator` - Get specific cart item row (returns locator for test assertions)

**Notes**:

- Handle cartId from URL or state
- Cart items might be list items or table rows - use semantic selectors
- **`isCartEmpty()` is acceptable** - combines conditional logic (count === 0 OR message visible), not just `.isVisible()`
- **Expose `emptyCartMessage` and `cartItems` locators** for simple visibility checks in tests

---

#### 1.8 Create Playwright Fixtures (pageFixtures.ts)

**File**: `e2e/fixtures/pageFixtures.ts`

**Purpose**: Combine Playwright page objects with domain fixtures from `@/test-lib/fixtures`

**Structure**:

```typescript
import { test as base } from "@playwright/test";
import { SignInPage } from "../pages/auth/SignInPage";
import { ProductListPage } from "../pages/products/ProductListPage";
import { ProductDetailsPage } from "../pages/products/ProductDetailsPage";
import { CartPage } from "../pages/cart/CartPage";

// Domain types imported from shared source
import type { IUser } from "@/features/auth/types/User";
import type { IProduct } from "@/features/products/types/Product";

type PageFixtures = {
  signInPage: SignInPage;
  productListPage: ProductListPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
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
});

export { expect } from "@playwright/test";
```

**Notes**:

- Export enhanced `test` and `expect` from this file
- All test files import from fixtures, not @playwright/test
- Each test gets fresh page object instances (test isolation)
- TypeScript infers types automatically
- Domain types (IUser, IProduct) imported from shared source
- Domain fixtures (UserFixture, ProductFixture) imported directly in test files

---

#### 1.9 Create Credential Fixtures (E2E-specific)

**File**: `e2e/fixtures/credentialFixtures.ts`

**Purpose**: E2E-specific test credentials (password not in domain model)

**Structure**:

```typescript
import { UserFixture } from "@/test-lib/fixtures/UserFixture";
import type { IUser } from "@/features/auth/types/User";

// AIDEV-NOTE: E2E-specific concern - passwords don't belong in domain User model
export interface TestCredentials {
  user: IUser; // ← Domain fixture from @/test-lib
  password: string; // ← E2E-specific (not in domain)
}

export const ValidUserCredentials: TestCredentials = {
  user: UserFixture.createPermutation({ username: "mor_2314" }),
  password: "83r5^_",
};

export const InvalidUserCredentials: TestCredentials = {
  user: UserFixture.createPermutation({ username: "wronguser" }),
  password: "wrongpassword",
};

// Helper to create custom credentials
export function createTestCredentials(
  userOverrides: Parameters<typeof UserFixture.createPermutation>[0] = {},
  password: string = "test_password"
): TestCredentials {
  return {
    user: UserFixture.createPermutation(userOverrides),
    password,
  };
}
```

**Notes**:

- **Reuses `UserFixture` from `@/test-lib/fixtures`** (domain data)
- Adds E2E-specific `password` field (not in domain User model)
- Single source of truth for user domain data
- Type-safe with domain IUser interface
- Easy to extend with more test credential variations

**Why separate credentials from domain fixtures?**

- Passwords are authentication concerns, not part of User domain model
- Keeps domain fixtures pure and focused on business logic
- E2E tests need credentials; unit tests don't
- Changes to User domain model automatically propagate to E2E tests

---

### Phase 2: Refactor Existing Tests

#### 2.1 Refactor sign-in.spec.ts

**File**: `e2e/tests/auth/sign-in.spec.ts` (new location)

**Changes**:

1. Import from fixtures: `import { test, expect } from '../../fixtures/pageFixtures'`
2. Import credentials: `import { ValidUserCredentials, InvalidUserCredentials } from '../../fixtures/credentialFixtures'`
3. Remove inline credentials constants
4. Use `signInPage` fixture in tests
5. Update beforeEach to use page objects
6. Replace direct locators with SignInPage methods
7. Use HeaderComponent for logout/sign-in button checks

**Test scenarios** (keep existing):

- ✅ "should successfully sign in with valid credentials"
- ✅ "should show error message with invalid credentials"

**Pseudocode**:

```typescript
import { test, expect } from "../../fixtures/pageFixtures";
import {
  ValidUserCredentials,
  InvalidUserCredentials,
} from "../../fixtures/credentialFixtures";
import { routes } from "@/lib/router/routes";

test.describe("Sign In", () => {
  test.beforeEach(async ({ signInPage }) => {
    await signInPage.goto();
  });

  test("should successfully sign in with valid credentials", async ({
    signInPage,
    page,
  }) => {
    const { user, password } = ValidUserCredentials;
    await signInPage.login(user.username, password);

    // Assertions stay in test - assert directly on exposed locators
    await expect(signInPage.successMessage).toBeVisible();
    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
  });

  test("should show error message with invalid credentials", async ({
    signInPage,
    page,
  }) => {
    const { user, password } = InvalidUserCredentials;
    await signInPage.login(user.username, password);

    await expect(signInPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(new RegExp(routes.signIn));
  });
});
```

**Migration checklist**:

- [ ] Move file to `e2e/tests/auth/sign-in.spec.ts`
- [ ] Import from fixtures
- [ ] Use credentialFixtures (which reuse UserFixture)
- [ ] Replace direct locators with SignInPage methods
- [ ] Keep assertions in test file
- [ ] Verify tests pass with new structure

---

### Phase 3: Add Product Tests

#### 3.1 Implement product-list.spec.ts

**File**: `e2e/tests/products/product-list.spec.ts`

**Test data**: Use `ProductFixture` from `@/test-lib/fixtures/ProductFixture`

**Test scenarios**:

**Display Tests**:

- `'should display products grid on page load'`
  - Navigate to products page
  - Assert product count > 0
  - Assert product grid is visible

- `'should show product information in cards'`
  - Get first product card (use ProductFixture for expected data)
  - Assert name is visible and not empty
  - Assert price is visible and > 0
  - Assert image is visible

**Navigation Tests**:

- `'should navigate to product details when clicking product card'`
  - Click specific product card
  - Assert URL changes to /products/:id/details
  - Assert product details page shows correct product

**Cart Actions Tests**:

- `'should add product to cart from grid'`
  - Get cart count from header (should be 0 or N)
  - Add product from grid
  - Assert cart badge count increases
  - Navigate to cart
  - Assert product appears in cart

**Pseudocode example**:

```typescript
import { test, expect } from "../../fixtures/pageFixtures";
import { ProductFixture } from "@/test-lib/fixtures/ProductFixture";

test.describe("Product List Page", () => {
  test.beforeEach(async ({ productListPage }) => {
    await productListPage.goto();
  });

  test.describe("Display", () => {
    test("should display products grid on page load", async ({
      productListPage,
    }) => {
      await productListPage.waitForProductsToLoad();

      const count = await productListPage.getProductCount();
      expect(count).toBeGreaterThan(0);

      await expect(productListPage.productGrid).toBeVisible();
    });

    test("should show product information in cards", async ({
      productListPage,
    }) => {
      // Use domain fixture for expected product data
      const expectedProduct = ProductFixture.createPermutation({
        name: "First Product Name",
      });

      const card = productListPage.getProductCard(expectedProduct.name);

      const name = await card.getName();
      const price = await card.getPrice();

      expect(name).toBeTruthy();
      expect(price).toBeGreaterThan(0);
      await expect(card.image).toBeVisible();
    });
  });

  test.describe("Cart Actions", () => {
    test("should add product to cart from grid", async ({
      productListPage,
      cartPage,
    }) => {
      const product = ProductFixture.createPermutation();

      await productListPage.addProductToCart(product.name);

      const cartCount = await productListPage.header.getCartItemCount();
      expect(cartCount).toBeGreaterThan(0);

      await productListPage.header.navigateToCart();

      const items = await cartPage.getCartItemNames();
      expect(items).toContain(product.name);
    });
  });
});
```

---

#### 3.2 Implement product-details.spec.ts

**File**: `e2e/tests/products/product-details.spec.ts`

**Test data**: Use `ProductFixture` from `@/test-lib/fixtures/ProductFixture`

**Test scenarios**:

**Display Tests**:

- `'should display product details correctly'`
  - Navigate to specific product
  - Assert title, price, description visible
  - Assert image visible

**Quantity Tests**:

- `'should update quantity input'`
  - Set quantity to 3
  - Assert input value is 3

**Cart Actions Tests**:

- `'should add product to cart with default quantity'`
  - Click add to cart
  - Assert cart badge increases
  - Navigate to cart
  - Assert product in cart

- `'should add product to cart with custom quantity'`
  - Set quantity to 3
  - Add to cart
  - Navigate to cart
  - Assert product in cart with quantity 3

**Pseudocode example**:

```typescript
import { test, expect } from "../../fixtures/pageFixtures";
import { ProductFixture } from "@/test-lib/fixtures/ProductFixture";

test.describe("Product Details Page", () => {
  const PRODUCT_ID = "1";

  test.beforeEach(async ({ productDetailsPage }) => {
    await productDetailsPage.goto(PRODUCT_ID);
  });

  test.describe("Display", () => {
    test("should display product details correctly", async ({
      productDetailsPage,
    }) => {
      const title = await productDetailsPage.getProductTitle();
      const price = await productDetailsPage.getProductPrice();

      expect(title).toBeTruthy();
      expect(price).toBeGreaterThan(0);

      await expect(productDetailsPage.productDescription).toBeVisible();
      await expect(productDetailsPage.addToCartButton).toBeVisible();
    });
  });

  test.describe("Cart Actions", () => {
    test("should add product to cart with custom quantity", async ({
      productDetailsPage,
      cartPage,
    }) => {
      await productDetailsPage.setQuantity(3);
      await productDetailsPage.addToCart();

      await productDetailsPage.header.navigateToCart();

      const count = await cartPage.getCartItemCount();
      expect(count).toBeGreaterThanOrEqual(3);
    });
  });
});
```

---

### Phase 4: Add Cart Tests

#### 4.1 Implement cart.spec.ts

**File**: `e2e/tests/cart/cart.spec.ts`

**Test data**: Use `ProductFixture` and `CartFixture` (if exists) from `@/test-lib/fixtures`

**Test scenarios**:

**Display Tests**:

- `'should display cart items with details'`
  - Add product to cart first (via product list)
  - Navigate to cart
  - Assert product name, price, quantity visible

**Update Tests**:

- `'should update item quantity'`
  - Add product to cart
  - Navigate to cart
  - Update quantity to 3
  - Assert quantity updated

**Remove Tests**:

- `'should remove item from cart'`
  - Add product to cart
  - Navigate to cart
  - Remove item
  - Assert item no longer in cart

- `'should show empty state after removing all items'`
  - Add product to cart
  - Navigate to cart
  - Remove item
  - Assert empty cart message visible

**Pseudocode example**:

```typescript
import { test, expect } from "../../fixtures/pageFixtures";
import { ProductFixture } from "@/test-lib/fixtures/ProductFixture";

test.describe("Cart Page", () => {
  test.describe("Display", () => {
    test("should display cart items with details", async ({
      productListPage,
      cartPage,
    }) => {
      // Setup: Add product to cart
      const product = ProductFixture.createPermutation();

      await productListPage.goto();
      await productListPage.addProductToCart(product.name);
      await productListPage.header.navigateToCart();

      // Assertions
      const items = await cartPage.getCartItemNames();
      expect(items).toContain(product.name);

      await expect(cartPage.cartTotal).toBeVisible();

      const total = await cartPage.getCartTotal();
      expect(total).toBeGreaterThan(0);
    });
  });

  test.describe("Remove", () => {
    test("should remove item from cart", async ({
      productListPage,
      cartPage,
    }) => {
      const product = ProductFixture.createPermutation();

      await productListPage.goto();
      await productListPage.addProductToCart(product.name);
      await productListPage.header.navigateToCart();

      const initialCount = await cartPage.getCartItemCount();

      await cartPage.removeItem(product.name);

      const items = await cartPage.getCartItemNames();
      expect(items).not.toContain(product.name);

      const newCount = await cartPage.getCartItemCount();
      expect(newCount).toBe(initialCount - 1);
    });
  });
});
```

---

## Sharing Domain Fixtures: Key Benefits

### Why Reuse `@/test-lib/fixtures` in E2E Tests?

1. **Single Source of Truth**
   - User, Product, Cart data defined once
   - Changes propagate to all test levels automatically
   - Eliminates fixture duplication and drift

2. **Type Safety Across Test Levels**
   - Shared TypeScript types (IUser, IProduct, ICart)
   - Type errors surface immediately if domain model changes
   - Consistent data structures in unit, component, and E2E tests

3. **Domain Alignment**
   - E2E tests use same entities and business rules as unit tests
   - Tests reflect actual domain model
   - Easier to reason about test data

4. **Maintenance Benefits**
   - Update fixture once, all tests updated
   - Refactor domain model safely
   - Less code to maintain

### Import Strategy

**Direct import from `@/test-lib` (recommended):**

```typescript
// e2e/tests/auth/sign-in.spec.ts
import { UserFixture } from "@/test-lib/fixtures/UserFixture";
import { ProductFixture } from "@/test-lib/fixtures/ProductFixture";

// Use domain fixtures directly
const user = UserFixture.createPermutation({ username: "testuser" });
const product = ProductFixture.createPermutation({ name: "Test Product" });
```

**Why this works:**

- Consistent import style across project (E2E already imports from `@/lib`)
- No duplication or synchronization issues
- Type safety maintained seamlessly
- Changes to fixtures propagate immediately

### When to Create E2E-Specific Fixtures

Create E2E-specific fixtures only for concerns that don't belong in domain models:

```typescript
// e2e/fixtures/credentialFixtures.ts
import { UserFixture } from "@/test-lib/fixtures/UserFixture";

export interface TestCredentials {
  user: IUser; // ← Domain fixture
  password: string; // ← E2E-specific (not in domain model)
}

export const ValidUserCredentials: TestCredentials = {
  user: UserFixture.createPermutation({ username: "mor_2314" }),
  password: "83r5^_",
};
```

**Keep these in `e2e/fixtures/`**:

- Authentication credentials (passwords)
- API tokens or session data
- Test infrastructure constants
- Browser-specific configurations

**Do NOT duplicate**:

- User domain data (use UserFixture)
- Product domain data (use ProductFixture)
- Cart domain data (use CartFixture)
- Any business entity data

---

## Key Principles to Follow

### 1. Locator Priority

1. `getByRole()` - Highest priority
2. `getByLabel()` - For form inputs
3. `getByText()` - For content
4. `getByPlaceholder()` - When labels unavailable
5. `getByTestId()` - Last resort

### 2. Assertions & State Exposure

**Core principle: Page objects expose state, tests make assertions**

✅ **DO - Expose locators directly:**

```typescript
class SignInPage {
  readonly successMessage: Locator; // Expose locator
}

// Test
await expect(signInPage.successMessage).toBeVisible(); // Test asserts
```

❌ **DON'T - Wrap simple visibility checks:**

```typescript
class SignInPage {
  async isSuccessMessageVisible(): Promise<boolean> {
    // ❌ BAD
    return await this.successMessage.isVisible();
  }
}
```

✅ **DO - Complex computed state helpers:**

```typescript
class HeaderComponent {
  async isLoggedIn(): Promise<boolean> {
    // ✅ GOOD - complex logic
    const logoutVisible = await this.logoutButton.isVisible();
    const signInHidden = !(await this.signInLink.isVisible());
    return logoutVisible && signInHidden;
  }
}

class CartPage {
  async isCartEmpty(): Promise<boolean> {
    // ✅ GOOD - complex logic
    const count = await this.getCartItemCount();
    return count === 0;
  }
}
```

⚠️ **EXCEPTION - Navigation verification:**

```typescript
async proceedToPayment(): Promise<this> {
  await this.page.getByRole('button', { name: 'Continue' }).click();
  await expect(this.paymentForm).toBeVisible();  // ✅ Acceptable: verifies navigation
  return this;
}
```

**Rule of thumb:** If the method does more than call `.isVisible()` or `.textContent()`, it's acceptable. Otherwise, expose the locator.

### 3. Method Design

- **Fluent interface**: Return `this` for chainable actions on same page
- **Page navigation**: Return new page object when navigating
- **State exposure**: Return primitives (string, number, boolean) for test assertions

### 4. Composition

- ✅ Use composition (HeaderComponent included in pages)
- ✅ Thin BasePage for universal behaviors only
- ❌ Avoid deep inheritance hierarchies

### 5. Test Isolation

- Each test should be independent
- Use fixtures for fresh instances
- Don't rely on test execution order
- Clean up state if needed (though tests should be stateless with API)

---

## Implementation Checklist

### Phase 1: Sign-in Test Foundation

**Goal**: Create only what's needed to refactor existing sign-in tests

- [x] Create `e2e/pages/base/BasePage.ts`
- [x] Create `e2e/pages/auth/SignInPage.ts`
- [x] Create `e2e/fixtures/pageFixtures.ts` (initially with only `signInPage` fixture)
- [x] Create `e2e/fixtures/credentialFixtures.ts` (reuses UserFixture)

### Phase 2: Refactor Sign-in Tests

**Goal**: Refactor existing tests to use POM structure

- [x] Move `e2e/sign-in.spec.ts` to `e2e/tests/auth/sign-in.spec.ts`
- [x] Refactor tests to use SignInPage
- [x] Replace inline credentials with credentialFixtures
- [x] Verify UserFixture is properly imported and reused
- [x] Verify tests pass

### Phase 3: Product List Tests

**Goal**: Add product list test coverage with necessary page objects

- [x] Create `e2e/pages/components/HeaderComponent.ts`
- [x] Create `e2e/pages/components/ProductCardComponent.ts`
- [x] Create `e2e/pages/products/ProductListPage.ts`
- [x] Update `e2e/fixtures/pageFixtures.ts` to add `productListPage` fixture
- [x] Create `e2e/tests/products/product-list.spec.ts`
- [x] Import ProductFixture from `@/test-lib/fixtures`
- [x] Implement display tests (2 tests)
- [x] Implement navigation tests (1 test)
- [x] Implement cart action tests (1 test)
- [x] Verify tests pass

### Phase 4: Product Details Tests

**Goal**: Add product details test coverage with necessary page objects

- [x] Create `e2e/pages/products/ProductDetailsPage.ts`
- [x] Update `e2e/fixtures/pageFixtures.ts` to add `productDetailsPage` fixture
- [x] Create `e2e/tests/products/product-details.spec.ts`
- [x] Test for checking if we can get back to products list page
- [x] Test for checking if we can add product to cart (with option to going to cart or continuing shopping meaning redirecting to products list), two tests in total that both require authentication
- [x] Enhanced ProductDetails component with semantic HTML (as="section")
- [x] Added `loginAndWaitForRedirect()` method to SignInPage for proper auth flow
- [x] Fixed test isolation by adding `storageState` configuration to prevent auth state leakage
- [x] All tests pass individually; occasional flakiness when running all together is expected with dev server

### Phase 5: Cart Tests

**Goal**: Add cart test coverage with necessary page objects

- [ ] Create `e2e/pages/cart/CartPage.ts`
- [ ] Update `e2e/fixtures/pageFixtures.ts` to add `cartPage` fixture
- [ ] Create `e2e/tests/cart/cart.spec.ts`
- [ ] Import ProductFixture and CartFixture from `@/test-lib/fixtures`
- [ ] todo test cases

---

## Testing Notes

### Running Tests

```bash
# Run all e2e tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e tests/auth/sign-in.spec.ts

# Run in UI mode (recommended for devcontainers)
pnpm test:e2e:ui

# Run in headed mode
pnpm test:e2e:headed

# Debug mode
pnpm test:e2e:debug
```

### Test Data Considerations

- **Reuse domain fixtures** from `@/test-lib/fixtures` for all domain entities
- Use real product IDs from test data (not MSW for E2E)
- Coordinate test data with actual API responses
- Create E2E-specific fixtures only for non-domain concerns (credentials, tokens)
- Cart IDs might be dynamic - handle accordingly

### Locator Investigation

Before implementing page objects, investigate actual DOM structure:

- Run app with `pnpm dev`
- Use Playwright Inspector or browser DevTools
- Verify actual role names, labels, and test IDs
- Adjust locators in plan if needed

---

## Success Criteria

- [ ] All existing sign-in tests pass with new structure
- [ ] 15-20 total e2e tests covering critical paths
- [ ] All tests use fixtures pattern (no direct page object instantiation)
- [ ] All tests use role-based locators (priority order followed)
- [ ] Assertions in test files, not page objects
- [ ] **Domain fixtures from `@/test-lib` reused in all E2E tests**
- [ ] **No duplication of domain fixture data**
- [ ] No code duplication (shared logic in page objects/components)
- [ ] Type-safe throughout (no any types)
- [ ] Tests run independently (can run in any order)
- [ ] CI-friendly (passes in headless mode)

---

## Future Enhancements (Out of Scope)

- Authentication setup project for parallel execution (auth.setup.ts)
- Critical flows smoke tests
- Visual regression testing
- Performance testing
- Accessibility testing
- Mobile viewport testing
- Additional domain fixtures (if needed for new features)
