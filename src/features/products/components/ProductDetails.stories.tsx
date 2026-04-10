import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { withRouter } from "storybook-addon-remix-react-router";

import { ProductFixture } from "@/test-lib/fixtures/product-fixture";
import { getAddToCartHandler } from "@/test-lib/handlers/get-add-to-cart-handler";
import { getMarketingProductHandler } from "@/test-lib/handlers/get-marketing-product-handler";

import { ProductDetails } from "./ProductDetails";

const meta = {
  title: "modules/Products/ProductDetails",
  component: ProductDetails,
  decorators: [withRouter],
  parameters: {
    layout: "centered",
    msw: {
      handlers: [getAddToCartHandler(), getMarketingProductHandler()],
    },
  },
} satisfies Meta<typeof ProductDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    product: ProductFixture.toStructure(),
    onBack: action("back to products' list"),
  },
};
