import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, screen } from "@storybook/testing-library";

import { Purchasing as CheckoutFormPurchasing } from "../CheckoutForm.stories";
import { CheckoutButton } from "./index";

const meta = {
  title: "modules/Carts/CheckoutButton",
  component: CheckoutButton,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof CheckoutButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Purchasing: Story = {
  play: async (context) => {
    const { canvasElement, step } = context;
    within(canvasElement);

    await step("Clear the cart", async () => {
      await userEvent.click(screen.getByRole("button", { name: /Checkout/ }));

      expect(
        await screen.getByRole("button", { name: "Purchase" })
      ).toBeInTheDocument();
    });

    await step("Submit the form", async () => {
      // eslint-disable-next-line storybook/context-in-play-function
      await CheckoutFormPurchasing.play!(context);
    });
  },
};
