import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";

import { getAddToCartHandler } from "utils";
import { ProductFixture } from "utils/fixtures";

import { ProductDetails } from "./ProductDetails";

const meta = {
  title: "modules/Products/ProductDetails",
  component: ProductDetails,
  decorators: [withRouter],
  parameters: {
    layout: "centered",
    msw: {
      handlers: [getAddToCartHandler()],
    },
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
