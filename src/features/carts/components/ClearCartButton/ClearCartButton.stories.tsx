import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, screen, expect } from "storybook/test";

import { ClearCartButton } from "@/features/carts/components/ClearCartButton/ClearCartButton";
import { getClearCartHandler } from "@/test-lib/handlers/get-clear-cart-handler";
import { sleep } from "@/test-lib/storybook/sleep";

const meta = {
  title: "modules/Carts/ClearCartButton",
  component: ClearCartButton,
  parameters: {
    layout: "centered",
    msw: {
      handlers: [getClearCartHandler()],
    },
  },
} satisfies Meta<typeof ClearCartButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ClearingCart: Story = {
  play: async ({ canvasElement, step }) => {
    within(canvasElement);

    await step("Clear the cart", async () => {
      await userEvent.click(screen.getByRole("button", { name: /Clear cart/ }));
      await expect(
        await screen.findByText(/Are you sure?/)
      ).toBeInTheDocument();
    });

    await step("Confirm clearing the cart", async () => {
      await sleep(500);

      await userEvent.click(
        screen.getByRole("button", { name: /Yes, clear cart/ })
      );
    });

    await expect(
      await screen.findByText("Your cart has been successfully cleared.")
    ).toBeInTheDocument();
  },
};
