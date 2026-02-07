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
      await userEvent.type(screen.getByLabelText(/Full Name/), "John Doe");
      await userEvent.type(
        screen.getByLabelText(/Address/),
        "NYC Groove Street"
      );
      await userEvent.selectOptions(
        screen.getByRole("combobox"),
        screen.getByRole("option", { name: "PayPal" })
      );
    });

    // https://cathalmacdonnacha.com/how-to-test-a-select-element-with-react-testing-library
    await expect(
      screen.getByRole<HTMLOptionElement>("option", { name: "PayPal" }).selected
    ).toBeTruthy();

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
