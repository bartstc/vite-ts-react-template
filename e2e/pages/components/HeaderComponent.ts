import type { Locator, Page } from "@playwright/test";

export class HeaderComponent {
  readonly signInLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.signInLink = page.getByRole("link", { name: /^sign in$/i });
    this.logoutButton = page.getByRole("button", { name: /logout/i });
  }
}
