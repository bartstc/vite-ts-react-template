import type { Meta, StoryObj } from "@storybook/react";

import { EmptyStateResult } from "./EmptyStateResult";

const meta = {
  component: EmptyStateResult,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof EmptyStateResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
