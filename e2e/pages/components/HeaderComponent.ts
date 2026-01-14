import type { Page, Locator } from "@playwright/test";

export class HeaderComponent {
  readonly signInLink: Locator;
  readonly logoutButton: Locator;
  readonly productsLink: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.signInLink = page.getByRole("link", { name: /sign in/i });
    this.logoutButton = page.getByRole("button", { name: /logout/i });
    this.productsLink = page.getByRole("link", { name: /products/i });
    this.cartBadge = page.getByTestId("cart-badge");
    this.cartLink = page.getByRole("link", { name: /cart/i });
  }

  async navigateToSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  async navigateToProducts(): Promise<void> {
    await this.productsLink.click();
  }

  async navigateToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async getCartItemCount(): Promise<number> {
    const text = await this.cartBadge.textContent();
    return text ? parseInt(text, 10) : 0;
  }

  // AIDEV-NOTE: Complex helper - combines multiple conditional checks (logout visible AND signIn hidden)
  async isLoggedIn(): Promise<boolean> {
    const logoutVisible = await this.logoutButton.isVisible();
    const signInHidden = !(await this.signInLink.isVisible());
    return logoutVisible && signInHidden;
  }
}
