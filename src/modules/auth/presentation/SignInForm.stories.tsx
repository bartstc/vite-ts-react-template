import type { Meta, StoryObj } from "@storybook/react";

import { SignInForm } from "./SignInForm";

const meta: Meta<typeof SignInForm> = {
  title: "Modules/Auth/SignInForm",
  component: SignInForm,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof SignInForm>;

export const Default: Story = {};
