import type { Page, Locator } from "@playwright/test";

import { BasePage } from "@e2e/pages/base/BasePage";

export class SignInPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByLabel(/username/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.signInButton = page.getByRole("button", { name: /sign in/i });
    this.errorMessage = page.getByText(
      "Failed to sign in. Please check your credentials and try again."
    );
    this.successMessage = page.getByText("Successfully signed in!");
  }

  async goto(): Promise<this> {
    await this.page.goto("/sign-in", { waitUntil: "networkidle" });
    return this;
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async fillUsername(username: string): Promise<this> {
    await this.usernameInput.fill(username);
    return this;
  }

  async fillPassword(password: string): Promise<this> {
    await this.passwordInput.fill(password);
    return this;
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }
}
