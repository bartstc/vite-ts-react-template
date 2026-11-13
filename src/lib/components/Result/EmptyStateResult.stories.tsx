import type { Meta, StoryObj } from "@storybook/react-vite";

import { EmptyStateResult } from "./EmptyStateResult";

const meta = {
  component: EmptyStateResult,
  tags: ["visual"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof EmptyStateResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
