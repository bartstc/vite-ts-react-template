import { expect, test } from "@e2e/fixtures";
import {
  InvalidUserCredentials,
  ValidUserCredentials,
} from "@e2e/fixtures/credentials-fixture";

test.describe("Sign in @auth", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("signs in and lands on the products list", async ({
    page,
    signInPage,
    productListPage,
  }) => {
    await test.step("open the sign-in page", async () => {
      await signInPage.goto();
    });

    await test.step("sign in", async () => {
      await signInPage.signIn(
        ValidUserCredentials.user.username,
        ValidUserCredentials.password
      );
      await expect(page).toHaveURL(/\/products$/);
      await expect(productListPage.heading).toBeVisible();
      await expect(signInPage.header.logoutButton).toBeVisible();
      await expect(signInPage.header.signInLink).toBeHidden();
    });
  });

  test("rejects invalid credentials and stays on sign-in", async ({
    page,
    signInPage,
  }) => {
    await signInPage.goto();
    await signInPage.signIn(
      InvalidUserCredentials.user.username,
      InvalidUserCredentials.password
    );

    // AIDEV-NOTE: only E2E check of the real API's 401 mapped to the UI
    await expect(page.getByText(/failed to sign in/i)).toBeVisible();
    await expect(page).toHaveURL(/\/sign-in$/);
  });

  test("asks a guest to sign in before adding to cart", async ({
    page,
    listedProduct,
    productListPage,
  }) => {
    await productListPage.goto();
    await productListPage.card(listedProduct.name).addToCart();

    await expect(
      page.getByText(/please log in in order to add products/i)
    ).toBeVisible();
    await expect(productListPage.addedDialog.root).toBeHidden();
  });
});
