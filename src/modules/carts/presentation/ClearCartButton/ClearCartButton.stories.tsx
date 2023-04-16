import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, screen } from "@storybook/testing-library";
import { rest } from "msw";

import { sleep } from "utils";
import { host } from "utils/http";

import { ClearCartButton } from "./index";

const meta = {
  title: "modules/Carts/ClearCartButton",
  component: ClearCartButton,
  parameters: {
    layout: "centered",
    msw: {
      handlers: [
        rest.delete(`${host}/carts/:cartId`, (req, res, ctx) => {
          return res(ctx.json({}));
        }),
      ],
    },
  },
} satisfies Meta<typeof ClearCartButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ClearingCart: Story = {
  play: async ({ canvasElement, step }) => {
    within(canvasElement);

    await step("Open confirmation dialog", async () => {
      await userEvent.click(screen.getByRole("button", { name: /Clear cart/ }));
      expect(await screen.findByText(/Are you sure?/)).toBeInTheDocument();
    });

    await step("Confirm", async () => {
      await sleep(500);

      await userEvent.click(screen.getByRole("button", { name: /Confirm/ }));
    });

    expect(
      await screen.findByText("Your cart has been successfully cleared.")
    ).toBeInTheDocument();
  },
};
