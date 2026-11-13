import type { Meta, StoryObj } from "@storybook/react-vite";

import { Footer } from "./index";

const meta = {
  component: Footer,
  tags: ["visual"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
