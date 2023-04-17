import type { Meta, StoryObj } from "@storybook/react";

import { TextInput } from "./TextInput";

const meta = {
  title: "shared/Form/TextInput",
  component: TextInput,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: "username", children: "Username" },
};

export const IsRequired: Story = {
  args: {
    ...Default.args,
    isRequired: true,
  },
};

export const IsOptional: Story = {
  args: {
    ...Default.args,
    isRequired: false,
  },
};
