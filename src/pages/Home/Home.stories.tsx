import type { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { withRouter } from "storybook-addon-react-router-v6";

import { buildUrl } from "utils";
import { ProductFixture } from "utils/fixtures";
import { host } from "utils/http";

import { Component } from "./index";
import { homePageLoader } from "./loader";

const meta = {
  title: "pages/Home",
  component: Component,
  parameters: {
    layout: "centered",
    reactRouter: {
      loader: homePageLoader,
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
