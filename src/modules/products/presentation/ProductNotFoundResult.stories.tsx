import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";

import { ProductNotFoundResult } from "./ProductNotFoundResult";

const meta: Meta<typeof ProductNotFoundResult> = {
  title: "modules/products/Results/ProductNotFoundResult",
  component: ProductNotFoundResult,
  decorators: [withRouter],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProductNotFoundResult>;

export const Default: Story = {};
