import { routes } from "@/lib/router/routes";
import {
  InvalidUserCredentials,
  ValidUserCredentials,
} from "@e2e/fixtures/credentials-fixture";
import { test, expect } from "@e2e/pages";

test.describe("Sign In", () => {
  test.beforeEach(async ({ signInPage }) => {
    await signInPage.goto();
  });

  test("should successfully sign in with valid credentials", async ({
    signInPage,
  }) => {
    await signInPage.login(
      ValidUserCredentials.user.username,
      ValidUserCredentials.password
    );

    await expect(signInPage.header.logoutButton).toBeVisible();
    await expect(signInPage.header.signInLink).not.toBeVisible();
  });

  test("should show error message with invalid credentials", async ({
    signInPage,
    page,
  }) => {
    await signInPage.login(
      InvalidUserCredentials.user.username,
      InvalidUserCredentials.password
    );

    await expect(
      page.getByText(
        "Failed to sign in. Please check your credentials and try again."
      )
    ).toBeVisible();
    await expect(page).toHaveURL(new RegExp(routes.signIn));
  });
});
