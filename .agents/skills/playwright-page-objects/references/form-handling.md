# Form Handling

Patterns for forms, multi-step flows, and validation.

## Fluent Interfaces

Use **fluent interfaces** (returning `this`) for chainable operations and **explicit navigation returns** when changing pages.

## Multi-Step Checkout Example

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

## Navigation Verification

Navigation assertions during state transitions are acceptable:

```typescript
async proceedToPayment(): Promise<this> {
  await this.page.getByRole('button', { name: 'Continue' }).click();
  await expect(this.paymentForm).toBeVisible();  // Acceptable: verifies navigation completed
  return this;
}
```

## Form Field Patterns

### Select/Dropdown

```typescript
await page.getByRole("combobox", { name: "Country" }).selectOption("US");
await page
  .getByRole("combobox", { name: "Size" })
  .selectOption({ label: "Medium" });
```

### Radio Buttons

```typescript
await page.getByRole("radio", { name: "Express shipping" }).check();
await page.getByRole("radio", { name: "3 stars" }).check();
```

### Checkboxes

```typescript
await page.getByRole("checkbox", { name: "Remember me" }).check();
await page.getByRole("checkbox", { name: "Subscribe" }).uncheck();
```

### Date Inputs

```typescript
await page.getByLabel("Birth Date").fill("1990-01-15");
```

## Testing All Form Fields

**Always test all form fields, including those with default values.** Use non-default values in tests to verify the selection mechanism works.

```typescript
// ❌ BAD - Only tests required fields
await page.getByLabel("Email").fill("test@example.com");
await page.getByRole("button", { name: "Submit" }).click();

// ✅ GOOD - Tests all fields with non-default values
await page.getByLabel("Email").fill("test@example.com");
await page.getByRole("combobox", { name: "Country" }).selectOption("CA"); // Not default
await page.getByRole("checkbox", { name: "Newsletter" }).check();
await page.getByRole("button", { name: "Submit" }).click();
```

## Form Component with Validation

Reusable component for forms with error handling:

```typescript
// components/FormComponent.ts
import { Page, Locator } from "@playwright/test";

export class FormComponent {
  readonly page: Page;
  readonly container: Locator;
  readonly submitButton: Locator;

  constructor(page: Page, formTestId: string) {
    this.page = page;
    this.container = page.getByTestId(formTestId);
    this.submitButton = this.container.getByRole("button", {
      name: /submit|save|create/i,
    });
  }

  async fillField(label: string, value: string): Promise<this> {
    await this.container.getByLabel(label).fill(value);
    return this;
  }

  async selectOption(label: string, value: string): Promise<this> {
    await this.container.getByLabel(label).selectOption(value);
    return this;
  }

  async checkCheckbox(label: string): Promise<this> {
    await this.container.getByLabel(label).check();
    return this;
  }

  async uncheckCheckbox(label: string): Promise<this> {
    await this.container.getByLabel(label).uncheck();
    return this;
  }

  async submit(): Promise<this> {
    await this.submitButton.click();
    return this;
  }

  // Expose validation state — tests make assertions
  async getFieldError(fieldName: string): Promise<string | null> {
    // Common patterns for error messages
    const errorLocator = this.container
      .locator(`[data-testid="${fieldName}-error"]`)
      .or(this.container.locator(`#${fieldName}-error`))
      .or(
        this.container
          .getByRole("alert")
          .filter({ hasText: new RegExp(fieldName, "i") })
      );

    if (await errorLocator.isVisible()) {
      return await errorLocator.textContent();
    }
    return null;
  }

  async hasFieldError(fieldName: string): Promise<boolean> {
    const error = await this.getFieldError(fieldName);
    return error !== null && error.trim() !== "";
  }

  async getFormErrors(): Promise<string[]> {
    const errors = await this.container.getByRole("alert").allTextContents();
    return errors.filter((e) => e.trim() !== "");
  }

  async hasFormErrors(): Promise<boolean> {
    const errors = await this.getFormErrors();
    return errors.length > 0;
  }
}
```

### Using Form Component

```typescript
// pages/RegistrationPage.ts
export class RegistrationPage {
  readonly page: Page;
  readonly form: FormComponent;

  constructor(page: Page) {
    this.page = page;
    this.form = new FormComponent(page, "registration-form");
  }

  async goto(): Promise<this> {
    await this.page.goto("/register");
    return this;
  }

  async register(email: string, password: string): Promise<this> {
    await this.form.fillField("Email", email);
    await this.form.fillField("Password", password);
    await this.form.fillField("Confirm Password", password);
    await this.form.submit();
    return this;
  }

  // Expose form's validation getters
  async getEmailError(): Promise<string | null> {
    return this.form.getFieldError("email");
  }

  async getPasswordError(): Promise<string | null> {
    return this.form.getFieldError("password");
  }
}
```

### Test with Validation

```typescript
test("should show validation errors", async ({ registrationPage }) => {
  await registrationPage.goto();
  await registrationPage.register("invalid-email", "123");

  // Assertions in test, not page object
  const emailError = await registrationPage.getEmailError();
  const passwordError = await registrationPage.getPasswordError();

  expect(emailError).toContain("valid email");
  expect(passwordError).toContain("at least 8 characters");
});

test("should register successfully", async ({ registrationPage, page }) => {
  await registrationPage.goto();
  await registrationPage.register("user@example.com", "SecurePass123!");

  await expect(page).toHaveURL("/welcome");
});
```
