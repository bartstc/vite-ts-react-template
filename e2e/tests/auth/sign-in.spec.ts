import { routes } from "@/lib/router/routes";
import {
  ValidUserCredentials,
  InvalidUserCredentials,
} from "@e2e/fixtures/credentials-fixture";
import { test, expect } from "@e2e/pages";

test.describe("Sign In", () => {
  test.beforeEach(async ({ signInPage }) => {
    await signInPage.goto();
  });

  test("should successfully sign in with valid credentials", async ({
    signInPage,
    page,
  }) => {
    await signInPage.login(
      ValidUserCredentials.user.username,
      ValidUserCredentials.password
    );

    await expect(signInPage.successMessage).toBeVisible();
    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign in/i })
    ).not.toBeVisible();
  });

  test("should show error message with invalid credentials", async ({
    signInPage,
    page,
  }) => {
    await signInPage.login(
      InvalidUserCredentials.user.username,
      InvalidUserCredentials.password
    );

    await expect(signInPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(new RegExp(routes.signIn));
  });
});
