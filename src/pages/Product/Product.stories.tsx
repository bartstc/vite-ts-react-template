import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "storybook-addon-remix-react-router";

import { getProductHandler } from "@/test-lib/handlers/get-product-handler";
import { putAddToCartHandler } from "@/test-lib/handlers/put-add-to-cart-handler";

import { productPageLoader } from "./loader";

import { Component } from "./index";

const PRODUCT_ID = "1";

const meta = {
  title: "pages/Product",
  component: Component,
  parameters: {
    layout: "centered",
    reactRouter: {
      routePath: "/products/:productId",
      routeParams: { productId: PRODUCT_ID },
      initialEntries: ["/products/:productId", "/products"],
      loader: productPageLoader,
    },
    msw: {
      handlers: [putAddToCartHandler(), getProductHandler()],
    },
  },
  decorators: [withRouter],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
