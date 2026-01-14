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
    await productListPage.selectFirstProduct();

    await expect(page).toHaveURL(/\/products\/\d+/);
  });

  test("should show error when trying to add product to cart without being logged in", async ({
    productListPage,
    page,
  }) => {
    await productListPage.waitForProductsToLoad();
    await productListPage.addFirstProductToCart();

    await expect(
      page.getByText(/please log in in order to add products/i)
    ).toBeVisible();
  });

  test.describe("Authenticated User", () => {
    test.beforeEach(async ({ signInPage }) => {
      await signInPage.goto();
      await signInPage.login();
    });

    test("should add product to cart from grid and continue browsing products", async ({
      productListPage,
      page,
    }) => {
      await productListPage.waitForProductsToLoad();
      await productListPage.addFirstProductToCart();

      const dialog = page.getByRole("alertdialog");

      await expect(dialog).toBeVisible();
      await expect(
        page.getByText(/product has been successfully added to your cart/i)
      ).toBeVisible();

      await page.getByRole("button", { name: /continue shopping/i }).click();

      await expect(dialog).not.toBeVisible();
      await expect(page).toHaveURL(/\/products$/);
    });

    test("should add product to cart from grid and navigate to cart when clicking go to cart button", async ({
      productListPage,
      page,
    }) => {
      await productListPage.waitForProductsToLoad();
      await productListPage.addFirstProductToCart();

      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible();

      await page.getByRole("button", { name: /go to cart/i }).click();

      await expect(page).toHaveURL(/\/cart\/\d+/);
    });
  });
});
