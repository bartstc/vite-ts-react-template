import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, screen } from "@storybook/testing-library";

import { sleep } from "utils";

import { CheckoutForm } from "./CheckoutForm";

const meta = {
  title: "modules/Carts/CheckboxForm",
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
    const canvas = within(canvasElement);

    await step("Enter credentials", async () => {
      await userEvent.type(canvas.getByLabelText(/Full Name/), "John Doe");
      await userEvent.type(
        canvas.getByLabelText(/Your address/),
        "NYC Groove Street"
      );
      await userEvent.selectOptions(
        canvas.getByRole("combobox"),
        canvas.getByRole("option", { name: "PayPal" })
      );
    });

    // https://cathalmacdonnacha.com/how-to-test-a-select-element-with-react-testing-library
    expect(
      await canvas.getByRole<HTMLOptionElement>("option", { name: "PayPal" })
        .selected
    ).toBeTruthy();

    await step("Submit form", async () => {
      await sleep(500);

      await userEvent.click(canvas.getByRole("button", { name: "Purchase" }));
    });

    expect(
      await screen.findByText(
        "You have successfully purchased all selected products."
      )
    ).toBeInTheDocument();
  },
};
