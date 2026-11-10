# Form Handling

Forms in page objects: how to find fields, how to model multi-step flows, how to check errors.

## Constraints

- Scope the form by `getByRole("form", { name })` or the dialog/region that contains it. A `<form>` needs an accessible
  name to have the `form` role — add `aria-label` or `aria-labelledby` in the component if it is missing.
- Fill fields by `getByLabel` or `getByRole("textbox" | "combobox" | "checkbox" | "radio", { name })`.
- One method per meaningful action (`fillShipping(data)`, `submit()`), taking a typed object for many fields.
- Each step of a multi-step form that changes the visible section ends with a readiness check on the next section.
- Field errors: `await expect(field).toHaveAccessibleErrorMessage(/required/i)`, or the visible error text scoped to the
  form. No fallback chains (`testid or #id or alert`) — they silently match the wrong element.
- **Fill what the path needs.** Each validation message and each non-default value is a story concern. Exception: a
  value that must round-trip through the real API (saved, then shown after reload) belongs in E2E.

## Example — multi-step form

```ts
import { expect, type Locator, type Page } from "@playwright/test";

export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
}

export class CheckoutPage {
  readonly shippingForm: Locator;
  readonly paymentForm: Locator;
  readonly confirmation: Locator;

  constructor(private readonly page: Page) {
    this.shippingForm = page.getByRole("form", { name: /shipping/i });
    this.paymentForm = page.getByRole("form", { name: /payment/i });
    this.confirmation = page.getByRole("region", { name: /order confirmed/i });
  }

  async fillShipping(info: ShippingInfo): Promise<void> {
    await this.shippingForm.getByLabel(/full name/i).fill(info.fullName);
    await this.shippingForm.getByLabel(/address/i).fill(info.address);
    await this.shippingForm.getByLabel(/city/i).fill(info.city);
  }

  async continueToPayment(): Promise<void> {
    await this.shippingForm.getByRole("button", { name: /continue/i }).click();
    await expect(this.paymentForm).toBeVisible(); // readiness check
  }

  async placeOrder(): Promise<void> {
    await this.paymentForm
      .getByRole("button", { name: /place order/i })
      .click();
    await expect(this.confirmation).toBeVisible(); // readiness check
  }
}
```

## Field patterns

```ts
await form.getByRole("combobox", { name: /country/i }).selectOption("GB");
await form.getByRole("radio", { name: /express/i }).check();
await form.getByRole("checkbox", { name: /remember me/i }).check();
await form.getByLabel(/delivery date/i).fill("2026-01-15");
```

Custom selects that are not a native `<select>` are opened by their `combobox` role and an option is picked with
`getByRole("option", { name })`.

## Error assertions

```ts
// ✅ accessible error tied to the field
await expect(
  checkoutPage.shippingForm.getByLabel(/city/i)
).toHaveAccessibleErrorMessage(/required/i);

// ❌ fallback chain — matches whichever exists, possibly the wrong one
this.container
  .locator(`[data-testid="${name}-error"]`)
  .or(this.container.locator(`#${name}-error`));
```
