import type { Meta, StoryObj } from "@storybook/react";

import { Select } from "./Select";

const meta = {
  title: "shared/Form/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "method",
    children: "Payment method",
    options: [
      { label: "BLIK", value: "blik" },
      { label: "PayPal", value: "paypal" },
    ],
  },
};
