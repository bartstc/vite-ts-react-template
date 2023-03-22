import { Button } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { NotFoundResult } from "./NotFoundResult";

const meta = {
  component: NotFoundResult,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof NotFoundResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    children: <Button colorScheme="blue">Back to home page</Button>,
  },
};
