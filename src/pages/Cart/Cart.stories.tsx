import type { Meta, StoryObj } from "@storybook/react-vite";
import { HttpResponse } from "msw";
import { withRouter } from "storybook-addon-remix-react-router";

import { CartFixture } from "@/test-lib/fixtures/cart-fixture";
import { getCartHandler } from "@/test-lib/handlers/get-cart-handler";
import { getClearCartHandler } from "@/test-lib/handlers/get-clear-cart-handler";
import { getProductHandler } from "@/test-lib/handlers/get-product-handler";

import { cartPageLoader } from "./loader";

import { Component } from "./index";

const CART_ID = 1;
const PRODUCT_ID_1 = 2;
const PRODUCT_ID_2 = 3;

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
        getClearCartHandler(),
      ],
    },
  },
};
