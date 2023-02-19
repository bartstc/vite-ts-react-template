import type { Meta, StoryObj } from "@storybook/react";

import { StarRating } from "./StarRating";

const meta: Meta<typeof StarRating> = {
  title: "Modules/Products/StarRating",
  component: StarRating,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof StarRating>;

export const Default: Story = {
  args: {
    rating: 3.7,
  },
};
