import type { Page, Locator } from "@playwright/test";

import type { PaymentMethod } from "@/features/carts/models/payment-method";
import { BasePage } from "@e2e/pages/base/BasePage";

export class CartPage extends BasePage {
  readonly checkoutButton: Locator;
  readonly checkoutDialog: Locator;
  private readonly fullNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly paymentMethodSelect: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);

    this.checkoutButton = page.getByRole("button", { name: /checkout/i });

    this.checkoutDialog = page.getByRole("alertdialog");

    this.fullNameInput = this.checkoutDialog.getByLabel(/full name/i);
    this.addressInput = this.checkoutDialog.getByLabel(/address/i);
    this.paymentMethodSelect =
      this.checkoutDialog.getByLabel(/payment method/i);
    this.submitButton = this.checkoutDialog.getByRole("button", {
      name: /complete order/i,
    });
  }

  async goto(cartId: string): Promise<this> {
    await this.page.goto(`/cart/${cartId}`, { waitUntil: "networkidle" });
    return this;
  }

  async openCheckoutDialog(): Promise<this> {
    await this.checkoutButton.click();
    return this;
  }

  async fillCheckoutForm(
    fullName: string,
    address: string,
    paymentMethod: PaymentMethod = "blik"
  ): Promise<this> {
    await this.fullNameInput.fill(fullName);
    await this.addressInput.fill(address);
    await this.paymentMethodSelect.selectOption(paymentMethod);
    return this;
  }

  async submitCheckout(): Promise<void> {
    await this.submitButton.click();
  }

  async completeCheckout(fullName: string, address: string): Promise<void> {
    await this.openCheckoutDialog();
    await this.fillCheckoutForm(fullName, address);
    await this.submitCheckout();
  }
}
