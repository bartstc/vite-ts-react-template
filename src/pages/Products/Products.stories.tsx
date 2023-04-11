import type { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { withRouter } from "storybook-addon-react-router-v6";

import { buildUrl } from "utils";
import { ProductFixture } from "utils/fixtures";
import { host } from "utils/http";

import { Component } from "./index";

const meta = {
  title: "pages/Products",
  component: Component,
  parameters: {
    layout: "centered",
  },
  decorators: [withRouter],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get(
          `${host}/${buildUrl("products", { limit: 10, sort: "asc" })}`,
          (req, res, ctx) => {
            return res(
              ctx.json(ProductFixture.createCollection([{ id: 1 }, { id: 2 }]))
            );
          }
        ),
      ],
    },
  },
};

export const WithoutProducts: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get(
          `${host}/${buildUrl("products", { limit: 10, sort: "asc" })}`,
          (req, res, ctx) => {
            return res(ctx.json([]));
          }
        ),
      ],
    },
  },
};
