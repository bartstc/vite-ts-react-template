import { Button } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

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
    children: <Button colorScheme="blue">Try again</Button>,
  },
};
