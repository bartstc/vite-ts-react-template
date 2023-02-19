import type { Meta, StoryObj } from "@storybook/react";

import { ProductFixture } from "utils/fixtures";

import { CartsList } from "./CartsList";

const meta: Meta<typeof CartsList> = {
  title: "Modules/Carts/CartsList",
  component: CartsList,
  parameters: {
    layout: "centered",
  },
};

const products = ProductFixture.createCollection([
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
]);

export default meta;
type Story = StoryObj<typeof CartsList>;

export const Default: Story = {
  args: {
    cartProducts: products.map((product) => ({
      ...product,
      quantity: product.id,
      imageUrl: product.image,
    })),
  },
};
