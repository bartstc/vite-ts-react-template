import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, screen } from "@storybook/testing-library";
import { rest } from "msw";

// import { withUser } from "utils";
import { host } from "utils/http";

import { AddToCartButton } from "./index";

const CART_ID = "1";

const meta = {
  title: "modules/Carts/AddToCartButton",
  component: AddToCartButton,
  //   decorators: [withUser],
  parameters: {
    layout: "centered",
    msw: {
      handlers: [
        rest.put(`${host}/carts/:cartId`, (req, res, ctx) => {
          return res(ctx.json({}));
        }),
      ],
    },
  },
} satisfies Meta<typeof AddToCartButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    productId: 3,
  },
};
