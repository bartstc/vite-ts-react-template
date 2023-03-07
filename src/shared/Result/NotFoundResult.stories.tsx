import { Button } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { NotFoundResult } from "./NotFoundResult";

const meta: Meta<typeof NotFoundResult> = {
  title: "Shared/Result/NotFoundResult",
  component: NotFoundResult,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof NotFoundResult>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    children: <Button colorScheme="blue">Back to home page</Button>,
  },
};
