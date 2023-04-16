import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";

import { getSignInHandler } from "utils";

import { SignInPage as Component } from "./index";

const meta = {
  title: "pages/SignIn",
  component: Component,
  parameters: {
    layout: "centered",
    msw: {
      handlers: [getSignInHandler()],
    },
  },
  decorators: [withRouter],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
