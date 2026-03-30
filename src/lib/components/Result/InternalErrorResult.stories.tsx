import { Button } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { InternalErrorResult } from "./InternalErrorResult";

const meta = {
  component: InternalErrorResult,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof InternalErrorResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    children: <Button colorPalette="blue">{"Try again"}</Button>,
  },
};
