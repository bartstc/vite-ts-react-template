import { Button } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { InternalServerErrorResult } from "./InternalServerErrorResult";

const meta = {
  component: InternalServerErrorResult,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof InternalServerErrorResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    children: <Button colorScheme="blue">Try again</Button>,
  },
};
