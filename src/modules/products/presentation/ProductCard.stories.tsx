import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";

import { ProductFixture } from "utils/fixtures";

import { ProductCard } from "./ProductCard";

const meta: Meta<typeof ProductCard> = {
  title: "Modules/Products/ProductCard",
  component: ProductCard,
  decorators: [withRouter],
  parameters: {
    layout: "centered",
  },
};

const product = ProductFixture.toStructure();

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    id: product.id,
    title: product.title,
    category: product.category,
    price: product.price,
    imageUrl: product.image,
  },
};
