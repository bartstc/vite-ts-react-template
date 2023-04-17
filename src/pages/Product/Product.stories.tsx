import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";

import { getAddToCartHandler, getProductHandler } from "utils";

import { Component } from "./index";
import { productPageLoader } from "./loader";

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
      handlers: [getAddToCartHandler(), getProductHandler()],
    },
  },
  decorators: [withRouter],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
