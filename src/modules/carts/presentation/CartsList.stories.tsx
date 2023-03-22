import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";

import { ProductFixture } from "utils/fixtures";

import { CartsList } from "./CartsList";

const meta = {
  title: "modules/Carts/CartsList",
  component: CartsList,
  decorators: [withRouter],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof CartsList>;

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
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cartProducts: products.map((product) => ({
      ...product,
      quantity: product.id,
      imageUrl: product.image,
    })),
  },
};
