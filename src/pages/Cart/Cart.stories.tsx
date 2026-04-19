import type { Meta, StoryObj } from "@storybook/react-vite";
import { HttpResponse } from "msw";
import { withRouter } from "storybook-addon-remix-react-router";

import { CartFixture } from "@/test-lib/fixtures/cart-fixture";
import { USER_CART_ID } from "@/test-lib/fixtures/user-fixture";
import { generateUuid } from "@/test-lib/generate-uuid";
import { deleteClearCartHandler } from "@/test-lib/handlers/delete-clear-cart-handler";
import { getCartHandler } from "@/test-lib/handlers/get-cart-handler";
import { getProductHandler } from "@/test-lib/handlers/get-product-handler";

import { cartPageLoader } from "./loader";

import { Component } from "./index";

const CART_ID = USER_CART_ID;
const PRODUCT_ID_1 = generateUuid();
const PRODUCT_ID_2 = generateUuid();

const meta = {
  title: "pages/Cart",
  component: Component,
  parameters: {
    layout: "centered",
    reactRouter: {
      routePath: "/cart/:cartId",
      routeParams: { cartId: CART_ID },
      loader: cartPageLoader,
    },
  },
  decorators: [withRouter],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        getCartHandler(() => {
          return HttpResponse.json(
            CartFixture.createPermutation({
              id: CART_ID,
              products: [
                { productId: PRODUCT_ID_1 },
                { productId: PRODUCT_ID_2 },
              ],
            })
          );
        }),
        getProductHandler(),
        deleteClearCartHandler(),
      ],
    },
  },
};
