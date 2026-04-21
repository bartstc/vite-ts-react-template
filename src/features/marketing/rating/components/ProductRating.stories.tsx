import type { Meta, StoryObj } from "@storybook/react-vite";

import { getMarketingProductHandler } from "@/test-lib/handlers/get-marketing-product-handler";

import { ProductRating } from "./ProductRating";

const meta = {
  title: "modules/Marketing/Rating/ProductRating",
  component: ProductRating,
  parameters: {
    layout: "centered",
    msw: {
      handlers: [getMarketingProductHandler()],
    },
  },
} satisfies Meta<typeof ProductRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    productId: "1",
  },
};
