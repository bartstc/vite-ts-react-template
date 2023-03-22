import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";

import { ProductFixture } from "utils/fixtures";

import { CartItem } from "./CartItem";

const meta = {
  title: "modules/Carts/CartItem",
  component: CartItem,
  decorators: [withRouter],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof CartItem>;

const product = ProductFixture.toStructure();

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: product.id,
    title: product.title,
    category: product.category,
    price: product.price,
    imageUrl: product.image,
    quantity: 4,
  },
};
