import { ValidUserCredentials } from "@e2e/fixtures/credentials-fixture";
import { test, expect } from "@e2e/pages";

test.describe("Product List Page", () => {
  test.beforeEach(async ({ productListPage }) => {
    await productListPage.goto();
  });

  test("should display products grid on page load", async ({
    productListPage,
  }) => {
    await productListPage.waitForProductsToLoad();

    const count = await productListPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test("should navigate to product details when clicking product card", async ({
    productListPage,
    page,
  }) => {
    await productListPage.waitForProductsToLoad();

    // AIDEV-NOTE: E2E tests use real API data, so we click the first product
    await productListPage.selectFirstProduct();

    // AIDEV-NOTE: Verify URL changed to product details page
    await expect(page).toHaveURL(/\/products\/\d+/);
  });

  test("should show error when trying to add product to cart without being logged in", async ({
    productListPage,
    page,
  }) => {
    await productListPage.waitForProductsToLoad();

    // AIDEV-NOTE: Try to add product without authentication
    await productListPage.addFirstProductToCart();

    // AIDEV-NOTE: Error toast should appear with login message
    await expect(
      page.getByText(/please log in in order to add products/i)
    ).toBeVisible();
  });

  test.describe("Authenticated User", () => {
    test.beforeEach(async ({ signInPage }) => {
      await signInPage.goto();
      await signInPage.login(
        ValidUserCredentials.user.username,
        ValidUserCredentials.password
      );
    });

    test("should add product to cart from grid and continue browsing products", async ({
      productListPage,
      page,
    }) => {
      await productListPage.waitForProductsToLoad();

      // AIDEV-NOTE: E2E tests use real API data, so we add the first product
      await productListPage.addFirstProductToCart();

      // AIDEV-NOTE: Dialog appears after adding product to cart
      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible();
      await expect(
        page.getByText(/product has been successfully added to your cart/i)
      ).toBeVisible();

      // AIDEV-NOTE: Click "Continue shopping" button in dialog
      await page.getByRole("button", { name: /continue shopping/i }).click();

      // AIDEV-NOTE: Dialog closes and user stays on products page
      await expect(dialog).not.toBeVisible();
      await expect(page).toHaveURL(/\/products$/);
    });

    test("should add product to cart from grid and navigate to cart when clicking go to cart button", async ({
      productListPage,
      page,
    }) => {
      await productListPage.waitForProductsToLoad();

      // AIDEV-NOTE: E2E tests use real API data, so we add the first product
      await productListPage.addFirstProductToCart();

      // AIDEV-NOTE: Dialog appears after adding product to cart
      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible();

      // AIDEV-NOTE: Click "Go to cart" button in dialog
      await page.getByRole("button", { name: /go to cart/i }).click();

      // AIDEV-NOTE: User navigates to cart page
      await expect(page).toHaveURL(/\/cart\/\d+/);
    });
  });
});
