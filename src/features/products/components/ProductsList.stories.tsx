import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "storybook-addon-remix-react-router";

import { ProductFixture } from "@/test-lib/fixtures/product-fixture";

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
      { id: "4f968992-1aab-49c9-8913-09405915c1c0" },
      { id: "4f968992-1aab-49c9-8913-09405915c1c1" },
      { id: "4f968992-1aab-49c9-8913-09405915c1c2" },
      { id: "4f968992-1aab-49c9-8913-09405915c1c3" },
      { id: "4f968992-1aab-49c9-8913-09405915c1c4" },
      { id: "4f968992-1aab-49c9-8913-09405915c1c5" },
      { id: "4f968992-1aab-49c9-8913-09405915c1c6" },
    ]),
  },
};

export const WithoutProducts: Story = {
  args: {
    products: [],
  },
};
