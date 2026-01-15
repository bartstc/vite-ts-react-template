import type { Page, Locator } from "@playwright/test";

import { ValidUserCredentials } from "@e2e/fixtures/credentials-fixture";
import { BasePage } from "@e2e/pages/base/BasePage";
import { HeaderComponent } from "@e2e/pages/components/HeaderComponent";

export class SignInPage extends BasePage {
  readonly header: HeaderComponent;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.usernameInput = page.getByLabel(/username/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.signInButton = page.getByRole("button", { name: /sign in/i });
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

  async loginAndWaitForRedirect(
    username: string = ValidUserCredentials.user.username,
    password: string = ValidUserCredentials.password
  ): Promise<void> {
    await this.login(username, password);
    // AIDEV-NOTE: Login automatically redirects to /products, wait for it
    await this.page.waitForURL(/\/products$/);
  }

  private async fillUsername(username: string): Promise<this> {
    await this.usernameInput.fill(username);
    return this;
  }

  private async fillPassword(password: string): Promise<this> {
    await this.passwordInput.fill(password);
    return this;
  }

  private async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }
}
