import { test, expect } from "@e2e/pages";

test.describe("Cart Page", () => {
  test.describe("Checkout Workflow", () => {
    test.beforeEach(async ({ signInPage, productDetailsPage, page }) => {
      await signInPage.goto();
      await signInPage.loginAndWaitForRedirect();

      await productDetailsPage.gotoFirstProduct();
      await productDetailsPage.addToCart();

      const dialog = page.getByRole("alertdialog");
      await dialog.getByRole("button", { name: /go to cart/i }).click();
      await page.waitForURL(/\/cart\/\d+$/);
    });

    test("should complete checkout workflow and show success message", async ({
      cartPage,
      page,
    }) => {
      await cartPage.openCheckoutDialog();

      await expect(cartPage.checkoutDialog).toBeVisible();

      await cartPage.fillCheckoutForm("John Doe", "123 Main Street", "card");
      await cartPage.submitCheckout();

      await expect(
        page.getByText(/you have successfully purchased all selected products/i)
      ).toBeVisible();
    });
  });
});
