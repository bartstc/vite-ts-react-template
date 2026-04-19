import type { Meta, StoryObj } from "@storybook/react-vite";
import { HttpResponse } from "msw";
import { withRouter } from "storybook-addon-remix-react-router";

import { getProductsHandler } from "@/test-lib/handlers/get-products-handler";
import { putAddToCartHandler } from "@/test-lib/handlers/put-add-to-cart-handler";

import { productsPageLoader } from "./loader";

import { Component } from "./index";

const meta = {
  title: "pages/Products",
  component: Component,
  parameters: {
    layout: "centered",
    reactRouter: {
      loader: productsPageLoader,
    },
  },
  decorators: [withRouter],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [getProductsHandler(), putAddToCartHandler()],
    },
  },
};

export const WithoutProducts: Story = {
  parameters: {
    msw: {
      handlers: [getProductsHandler(() => HttpResponse.json([]))],
    },
  },
};
