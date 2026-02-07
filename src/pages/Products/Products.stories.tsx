import type { Meta, StoryObj } from "@storybook/react-vite";
import { HttpResponse } from "msw";
import { withRouter } from "storybook-addon-remix-react-router";

import { getAddToCartHandler } from "@/test-lib/handlers/get-add-to-cart-handler";
import { getProductsHandler } from "@/test-lib/handlers/get-products-handler";

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
      handlers: [getProductsHandler(), getAddToCartHandler()],
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
