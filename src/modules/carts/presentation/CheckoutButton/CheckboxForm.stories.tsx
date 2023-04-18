import type { Meta, StoryObj } from "@storybook/react";

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

export const Default: Story = {
  args: {},
};
