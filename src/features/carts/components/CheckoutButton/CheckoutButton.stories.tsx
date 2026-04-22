import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, screen, expect } from "storybook/test";

import { CheckoutButton } from "@/features/carts/components/CheckoutButton/CheckoutButton";

import { Purchasing as CheckoutFormPurchasing } from "../CheckoutForm.stories";

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
    const { step } = context;
    await step("Clear the cart", async () => {
      await userEvent.click(screen.getByRole("button", { name: /Checkout/ }));

      await expect(
        screen.getByRole("button", { name: "Complete Order" })
      ).toBeInTheDocument();
    });

    await step("Submit the form", async () => {
      // eslint-disable-next-line storybook/context-in-play-function
      await CheckoutFormPurchasing.play?.(context);
    });
  },
};
