import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, screen, expect } from "storybook/test";

import { ClearCartButton } from "@/features/carts/components/ClearCartButton/ClearCartButton";
import { deleteClearCartHandler } from "@/test-lib/handlers/delete-clear-cart-handler";

const meta = {
  title: "modules/Carts/ClearCartButton",
  component: ClearCartButton,
  parameters: {
    layout: "centered",
    msw: {
      handlers: [deleteClearCartHandler()],
    },
  },
} satisfies Meta<typeof ClearCartButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ClearingCart: Story = {
  play: async ({ step }) => {
    await step("Clear the cart", async () => {
      await userEvent.click(screen.getByRole("button", { name: /Clear cart/ }));
      await expect(
        await screen.findByText(/Are you sure?/)
      ).toBeInTheDocument();
    });

    await step("Confirm clearing the cart", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /Yes, clear cart/ })
      );
      await expect(
        await screen.findByText("Your cart has been successfully cleared.")
      ).toBeInTheDocument();
    });
  },
};
