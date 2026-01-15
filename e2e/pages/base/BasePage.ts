import type { Page } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  getCurrentUrl(): string {
    return this.page.url();
  }
}
