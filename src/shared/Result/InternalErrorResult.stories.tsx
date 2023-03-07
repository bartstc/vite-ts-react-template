import { Button } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { InternalErrorResult } from "./InternalErrorResult";

const meta: Meta<typeof InternalErrorResult> = {
  title: "Shared/Result/InternalErrorResult",
  component: InternalErrorResult,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof InternalErrorResult>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    children: <Button colorScheme="blue">Try again</Button>,
  },
};
