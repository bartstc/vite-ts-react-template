import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";

import { ProductFixture } from "utils/fixtures";

import { ProductsList } from "./ProductsList";

const meta: Meta<typeof ProductsList> = {
  title: "Modules/Products/ProductsList",
  component: ProductsList,
  decorators: [withRouter],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProductsList>;

export const Default: Story = {
  args: {
    products: ProductFixture.createCollection([
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
      {
        id: 4,
      },
      {
        id: 5,
      },
      {
        id: 6,
      },
      {
        id: 7,
      },
    ]),
  },
};
