import type { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { withRouter } from "storybook-addon-react-router-v6";

import { ProductFixture } from "utils/fixtures";
import { host } from "utils/http";

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
  },
  decorators: [withRouter],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get(`${host}/products/${PRODUCT_ID}`, (req, res, ctx) => {
          return res(ctx.json(ProductFixture.toStructure()));
        }),
      ],
    },
  },
};
