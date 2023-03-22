import type { Meta, StoryObj } from "@storybook/react";

import { StarRating } from "./StarRating";

const meta = {
  title: "modules/Products/StarRating",
  component: StarRating,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rating: 3.7,
  },
};
