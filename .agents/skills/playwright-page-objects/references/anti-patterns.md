# Anti-Patterns

Common mistakes that kill maintainability in Playwright page objects.

## 1. Assertions Buried in Page Objects

**Problem:** Test logic hidden in page object methods.

```typescript
// ❌ BAD - Hidden assertion
class CartPage {
  async verifyItemInCart(productName: string): Promise<void> {
    await expect(this.cartItems).toContainText(productName); // Hidden assertion
    await expect(this.cartTotal).toBeVisible(); // More hidden assertions
  }
}
```

**Solution:** Page objects expose state, tests make assertions.

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

**Exception:** Navigation verification assertions are acceptable:

```typescript
async proceedToPayment(): Promise<this> {
  await this.page.getByRole('button', { name: 'Continue' }).click();
  await expect(this.paymentForm).toBeVisible();  // Acceptable: verifies navigation completed
  return this;
}
```

## 2. Fat Page Objects

**Problem:** Classes with 50+ locators and 20+ methods become unmaintainable.

**Solution:** Split into focused components.

```typescript
// ❌ BAD - Everything in one class
class ProductPage {
  // 60 locators...
  // 30 methods...
}

// ✅ GOOD - Separated concerns
class ProductDetailsPage {
  readonly header: HeaderComponent;
  readonly productInfo: ProductInfoSection;
  readonly reviewsSection: ReviewsComponent;
  readonly relatedProducts: ProductGridComponent;
}
```

## 3. Deep Inheritance Hierarchies

**Problem:** Rigid, hard-to-modify class chains.

```typescript
// ❌ BAD - 4 levels deep
class BasePage {}
class AuthenticatedPage extends BasePage {}
class AdminPage extends AuthenticatedPage {}
class AdminSettingsPage extends AdminPage {}
```

**Solution:** Use composition.

```typescript
// ✅ GOOD - Flat composition
class AdminSettingsPage {
  readonly auth: AuthComponent;
  readonly adminNav: AdminNavComponent;
  readonly settings: SettingsComponent;
}
```

## 4. Tight Coupling to Locators

**Problem:** Tests access locators directly, breaking encapsulation.

```typescript
// ❌ BAD - Direct locator access
test("login", async ({ loginPage }) => {
  await loginPage.usernameField.fill("user");
  await loginPage.passwordField.fill("pass");
  await loginPage.submitBtn.click();
});
```

**Solution:** Use semantic methods.

```typescript
// ✅ GOOD - Semantic action
test("login", async ({ loginPage }) => {
  await loginPage.login("user", "pass");
});
```

## 5. Wrapping Playwright API

**Problem:** Creating unnecessary `click()` or `fill()` wrapper methods.

```typescript
// ❌ BAD - Pointless wrapper
class BasePage {
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }
}
```

**Solution:** Just use Playwright directly.

```typescript
// ✅ GOOD - Direct Playwright usage
await this.submitButton.click();
```

## 6. All Members Public

**Problem:** Exposing internal implementation details.

```typescript
// ❌ BAD - Everything public
class CartPage {
  loadingSpinner: Locator; // Internal detail
  retryCount: number; // Internal state
}
```

**Solution:** Mark internal members private.

```typescript
// ✅ GOOD - Proper encapsulation
class CartPage {
  private loadingSpinner: Locator;
  private retryCount: number;

  // Public interface only
  readonly cartItems: Locator;
  async addItem(): Promise<this> { ... }
}
```

## 7. Skipping Optional/Default Form Fields

**Problem:** Only testing required fields, missing validation of optional fields.

```typescript
// ❌ BAD - Skips optional fields
await page.getByLabel("Email").fill("test@example.com");
await page.getByRole("button", { name: "Submit" }).click();
```

**Solution:** Test all fields with non-default values.

```typescript
// ✅ GOOD - Tests all fields
await page.getByLabel("Email").fill("test@example.com");
await page.getByRole("combobox", { name: "Country" }).selectOption("CA");
await page.getByRole("checkbox", { name: "Newsletter" }).check();
await page.getByRole("button", { name: "Submit" }).click();
```

## 8. Toast/Notification Locators in POMs

**Problem:** Including transient UI elements in page objects.

```typescript
// ❌ BAD - Toast in page object
class CheckoutPage {
  readonly successToast: Locator;
  readonly errorToast: Locator;
}
```

**Solution:** Assert toasts directly in tests.

```typescript
// ✅ GOOD - Toast assertion in test
test("checkout shows success message", async ({ checkoutPage, page }) => {
  await checkoutPage.placeOrder();
  await expect(page.getByText("Order placed successfully")).toBeVisible();
});
```

## Summary Table

| Anti-Pattern         | Problem                     | Solution                      |
| -------------------- | --------------------------- | ----------------------------- |
| Assertions in POMs   | Hidden test logic           | Expose state, assert in tests |
| Fat page objects     | 50+ locators unmaintainable | Split into components         |
| Deep inheritance     | Rigid hierarchies           | Use composition               |
| Tight coupling       | Direct locator access       | Semantic methods              |
| Wrapping Playwright  | Unnecessary abstraction     | Use Playwright directly       |
| All public members   | Exposes internals           | Use private for internal      |
| Skip optional fields | Miss validation bugs        | Test all fields               |
| Toasts in POMs       | Transient UI as state       | Assert in tests               |
