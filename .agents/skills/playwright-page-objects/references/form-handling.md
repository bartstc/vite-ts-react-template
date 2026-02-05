# Form Handling

Patterns for multi-step forms, checkout flows, and complex user interactions.

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

**Always test all form fields, including those with default values.** Use non-default values in tests to verify the selection mechanism works, not just default rendering.

```typescript
// ❌ BAD - Only tests required fields
await page.getByLabel("Email").fill("test@example.com");
await page.getByRole("button", { name: "Submit" }).click();

// ✅ GOOD - Tests all fields with non-default values
await page.getByLabel("Email").fill("test@example.com");
await page.getByRole("combobox", { name: "Country" }).selectOption("CA"); // Not default "US"
await page.getByRole("checkbox", { name: "Newsletter" }).check(); // Test the checkbox
await page.getByRole("button", { name: "Submit" }).click();
```
