import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import { ProductFixture } from "utils/fixtures";

import { ProductDetails } from "./ProductDetails";

const meta: Meta<typeof ProductDetails> = {
  title: "Modules/Products/ProductDetails",
  component: ProductDetails,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof ProductDetails>;

export const Default: Story = {
  args: {
    product: ProductFixture.toStructure(),
    onBack: action("back to products' list"),
  },
};
