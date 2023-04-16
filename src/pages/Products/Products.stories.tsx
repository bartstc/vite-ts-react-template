import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";

import { getProductsHandler } from "utils";

import { Component } from "./index";
import { productsPageLoader } from "./loader";

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
      handlers: [getProductsHandler()],
    },
  },
};

export const WithoutProducts: Story = {
  parameters: {
    msw: {
      handlers: [getProductsHandler((req, res, ctx) => res(ctx.json([])))],
    },
  },
};
