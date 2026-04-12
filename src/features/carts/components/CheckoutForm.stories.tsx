import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, screen, expect } from "storybook/test";

import { sleep } from "@/test-lib/storybook/sleep";

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
  play: async ({ canvasElement, step }) => {
    within(canvasElement);

    await step("Enter credentials", async () => {
      await userEvent.type(screen.getByLabelText(/Full Name/i), "John Doe");
      await userEvent.type(
        screen.getByLabelText(/Address/i),
        "NYC Groove Street"
      );
      await userEvent.click(screen.getByRole("combobox"));
      await sleep(100);
      await userEvent.click(screen.getByRole("option", { name: "PayPal" }));
      await sleep(100);
    });

    await expect(screen.getByRole("combobox")).toHaveTextContent("PayPal");

    await step("Submit form", async () => {
      await sleep(500);

      await userEvent.click(
        screen.getByRole("button", { name: "Complete Order" })
      );
    });

    await expect(
      await screen.findByText(
        "You have successfully purchased all selected products."
      )
    ).toBeInTheDocument();
  },
};
