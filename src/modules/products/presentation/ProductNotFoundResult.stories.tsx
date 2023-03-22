import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";

import { ProductNotFoundResult } from "./ProductNotFoundResult";

const meta = {
  title: "modules/products/Results/ProductNotFoundResult",
  component: ProductNotFoundResult,
  decorators: [withRouter],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ProductNotFoundResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
