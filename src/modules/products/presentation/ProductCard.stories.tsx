import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";

import { getAddToCartHandler } from "utils";
import { ProductFixture } from "utils/fixtures";

import { ProductCard } from "./ProductCard";

const meta = {
  title: "modules/Products/ProductCard",
  component: ProductCard,
  decorators: [withRouter],
  parameters: {
    layout: "centered",
    msw: {
      handlers: [getAddToCartHandler()],
    },
  },
} satisfies Meta<typeof ProductCard>;

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
  },
};
