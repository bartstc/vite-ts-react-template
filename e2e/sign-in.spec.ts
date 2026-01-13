import { test, expect } from "@playwright/test";

import { routes } from "@/lib/router/routes";

const VALID_CREDENTIALS = {
  username: "mor_2314",
  password: "83r5^_",
} as const;

const INVALID_CREDENTIALS = {
  username: "wronguser",
  password: "wrongpassword",
} as const;

test.describe("Sign In", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL!, { waitUntil: "networkidle" });
    // await page.waitForLoadState("networkidle");
    await page.getByRole("link", { name: /sign in/i }).click();
    await expect(page).toHaveURL(new RegExp(routes.signIn));
  });

  test("should successfully sign in with valid credentials", async ({
    page,
  }) => {
    await page.getByLabel(/username/i).fill(VALID_CREDENTIALS.username);
    await page.getByLabel(/password/i).fill(VALID_CREDENTIALS.password);

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/successfully signed in/i)).toBeVisible();

    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign in/i })
    ).not.toBeVisible();
  });

  test("should show error message with invalid credentials", async ({
    page,
  }) => {
    await page.getByLabel(/username/i).fill(INVALID_CREDENTIALS.username);
    await page.getByLabel(/password/i).fill(INVALID_CREDENTIALS.password);

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(
      page.getByText(
        /Failed to sign in. Please check your credentials and try again/i
      )
    ).toBeVisible();

    await expect(page).toHaveURL(new RegExp(routes.signIn));
  });
});
