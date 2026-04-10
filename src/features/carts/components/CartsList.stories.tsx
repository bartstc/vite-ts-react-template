import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "storybook-addon-remix-react-router";

import { ProductFixture } from "@/test-lib/fixtures/product-fixture";

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
  { id: "4f968992-1aab-49c9-8913-09405915c1c0" },
  { id: "4f968992-1aab-49c9-8913-09405915c1c1" },
  { id: "4f968992-1aab-49c9-8913-09405915c1c2" },
]);

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cartProducts: products.map((product, i) => ({
      ...product,
      quantity: i + 1,
    })),
  },
};
