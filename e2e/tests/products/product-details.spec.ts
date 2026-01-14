import { test, expect } from "@e2e/pages";

const ROUTES = {
  PRODUCTS: /\/products$/,
  PRODUCT_DETAILS: /\/products\/\d+$/,
  CART: /\/cart\/\d+$/,
} as const;

test.describe("Product Details Page", () => {
  test.describe("Unauthenticated User", () => {
    test.beforeEach(async ({ productDetailsPage }) => {
      await productDetailsPage.gotoFirstProduct();
    });

    test("should navigate back to products list page", async ({
      productDetailsPage,
      page,
    }) => {
      await productDetailsPage.navigateBackToList();

      await expect(page).toHaveURL(ROUTES.PRODUCTS);
    });
  });

  test.describe("Authenticated User", () => {
    test.beforeEach(async ({ signInPage, productDetailsPage }) => {
      await signInPage.goto();
      await signInPage.loginAndWaitForRedirect();
      await productDetailsPage.gotoFirstProduct();
    });

    test("should add product to cart and continue shopping", async ({
      productDetailsPage,
      page,
    }) => {
      await productDetailsPage.addToCart();

      const dialog = page.getByRole("alertdialog");

      await expect(dialog).toBeVisible();
      await expect(
        page.getByText(/product has been successfully added to your cart/i)
      ).toBeVisible();

      await dialog.getByRole("button", { name: /continue shopping/i }).click();

      await expect(dialog).not.toBeVisible();
      await expect(page).toHaveURL(ROUTES.PRODUCTS);
    });

    test("should add product to cart and navigate to cart when clicking go to cart button", async ({
      productDetailsPage,
      page,
    }) => {
      await productDetailsPage.addToCart();

      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible();

      await dialog.getByRole("button", { name: /go to cart/i }).click();

      await expect(page).toHaveURL(ROUTES.CART);
    });
  });
});
