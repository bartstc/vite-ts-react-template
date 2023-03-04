import type { Meta, StoryObj } from "@storybook/react";

import { Demo } from "./Demo";

const meta: Meta<typeof Demo> = {
  title: "Modules/Demo",
  component: Demo,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Demo>;

export const Default: Story = {};
