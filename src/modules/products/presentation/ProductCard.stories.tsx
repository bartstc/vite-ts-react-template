import type { Meta, StoryObj } from "@storybook/react";

import { ProductFixture } from "utils/fixtures";

import { ProductCard } from "./ProductCard";

const meta: Meta<typeof ProductCard> = {
  title: "Modules/Products/ProductCard",
  component: ProductCard,
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
