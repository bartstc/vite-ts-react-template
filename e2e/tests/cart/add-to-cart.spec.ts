import { expect, test } from "@e2e/fixtures";

test.describe("Add to cart @cart", () => {
  test("adds a product from its details page and shows it in the cart", async ({
    page,
    product,
    productDetailsPage,
    cartPage,
  }) => {
    await test.step("open the product", async () => {
      await productDetailsPage.goto(product.id);
      await expect(productDetailsPage.heading(product.name)).toBeVisible();
    });

    await test.step("add it to the cart", async () => {
      await productDetailsPage.addToCart();
      await expect(productDetailsPage.addedDialog.root).toBeVisible();
    });

    await test.step("go to the cart", async () => {
      await productDetailsPage.addedDialog.goToCart();
      await expect(page).toHaveURL(/\/cart\/.+/);
      await expect(cartPage.heading).toBeVisible();
      await expect(cartPage.item(product.name)).toBeVisible();
    });
  });

  test("adds a product from the list and keeps shopping", async ({
    page,
    listedProduct,
    productListPage,
  }) => {
    await test.step("open the products list", async () => {
      await productListPage.goto();
    });

    await test.step("add a product to the cart", async () => {
      await productListPage.card(listedProduct.name).addToCart();
      await expect(productListPage.addedDialog.root).toBeVisible();
    });

    await test.step("continue shopping", async () => {
      await productListPage.addedDialog.continueShopping();
      await expect(productListPage.addedDialog.root).toBeHidden();
      await expect(page).toHaveURL(/\/products$/);
    });
  });
});
