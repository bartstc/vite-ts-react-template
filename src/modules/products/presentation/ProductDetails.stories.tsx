import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import { ProductFixture } from "utils/fixtures";

import { ProductDetails } from "./ProductDetails";

const meta = {
  title: "modules/Products/ProductDetails",
  component: ProductDetails,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ProductDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    product: ProductFixture.toStructure(),
    onBack: action("back to products' list"),
  },
};
