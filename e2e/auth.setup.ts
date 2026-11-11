import { expect, test as setup } from "@e2e/fixtures";
import { ValidUserCredentials } from "@e2e/fixtures/credentials-fixture";

// AIDEV-NOTE: keep in sync with `storageState` in playwright.config.ts (git-ignored folder)
const AUTH_FILE = "playwright/.auth/user.json";

setup("sign in", async ({ page, signInPage }) => {
  await signInPage.goto();
  await signInPage.signIn(
    ValidUserCredentials.user.username,
    ValidUserCredentials.password
  );
  await expect(signInPage.header.logoutButton).toBeVisible();

  await page.context().storageState({ path: AUTH_FILE });
});
