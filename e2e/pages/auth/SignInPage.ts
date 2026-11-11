import { expect, type Locator, type Page } from "@playwright/test";

import { HeaderComponent } from "@e2e/pages/components/HeaderComponent";

export class SignInPage {
  readonly header: HeaderComponent;
  readonly heading: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.heading = page.getByRole("heading", {
      name: /sign in to your account/i,
    });
    this.usernameInput = page.getByLabel(/username/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.signInButton = page.getByRole("button", { name: /^sign in$/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/sign-in");
    await expect(this.heading).toBeVisible();
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
