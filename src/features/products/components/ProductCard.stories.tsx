import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "storybook-addon-remix-react-router";

import { ProductFixture } from "@/test-lib/fixtures/product-fixture";
import { getAddToCartHandler } from "@/test-lib/handlers/get-add-to-cart-handler";

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
    name: product.name,
    category: product.category,
    price: product.price,
    imageUrl: product.imageUrl,
  },
};
