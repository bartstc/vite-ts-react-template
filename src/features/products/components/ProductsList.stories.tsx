import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "storybook-addon-remix-react-router";

import { ProductFixture } from "@/test-lib/fixtures/product-fixture";
import { generateUuid } from "@/test-lib/generate-uuid";

import { ProductsList } from "./ProductsList";

const meta = {
  title: "modules/Products/ProductsList",
  component: ProductsList,
  decorators: [withRouter],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ProductsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    products: ProductFixture.createCollection([
      { id: generateUuid() },
      { id: generateUuid() },
      { id: generateUuid() },
      { id: generateUuid() },
      { id: generateUuid() },
      { id: generateUuid() },
      { id: generateUuid() },
    ]),
  },
};

export const WithoutProducts: Story = {
  args: {
    products: [],
  },
};
