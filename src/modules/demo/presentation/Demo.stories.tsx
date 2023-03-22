import type { Meta, StoryObj } from "@storybook/react";

import { Demo } from "./Demo";

const meta = {
  title: "modules/Demo",
  component: Demo,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
