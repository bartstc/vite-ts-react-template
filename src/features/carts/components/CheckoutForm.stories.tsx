import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, screen, expect } from "storybook/test";

import { CheckoutForm } from "./CheckoutForm";

const meta = {
  title: "modules/Carts/CheckoutForm",
  component: CheckoutForm,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof CheckoutForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Purchasing: Story = {
  play: async ({ step }) => {
    await step("Enter credentials", async () => {
      await userEvent.type(screen.getByLabelText(/Full Name/i), "John Doe");
      await userEvent.type(
        screen.getByLabelText(/Address/i),
        "NYC Groove Street"
      );
      await userEvent.click(
        screen.getByRole("combobox", { name: /Payment Method/i })
      );
      await userEvent.click(screen.getByRole("option", { name: "PayPal" }));
      await expect(screen.getByRole("combobox")).toHaveTextContent("PayPal");
    });

    await step("Submit form", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: "Complete Order" })
      );
      await expect(
        await screen.findByText(
          "You have successfully purchased all selected products."
        )
      ).toBeInTheDocument();
    });
  },
};
