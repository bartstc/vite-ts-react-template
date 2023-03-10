import { Button } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { InternalServerErrorResult } from "./InternalServerErrorResult";

const meta: Meta<typeof InternalServerErrorResult> = {
  title: "Shared/Result/InternalServerErrorResult",
  component: InternalServerErrorResult,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof InternalServerErrorResult>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    children: <Button colorScheme="blue">Try again</Button>,
  },
};
