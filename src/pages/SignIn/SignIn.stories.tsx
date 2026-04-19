import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "storybook-addon-remix-react-router";

import { postSignInHandler } from "@/test-lib/handlers/post-sign-in-handler";

import { SignInPage as Component } from "./index";

const meta = {
  title: "pages/SignIn",
  component: Component,
  parameters: {
    layout: "centered",
    msw: {
      handlers: [postSignInHandler()],
    },
  },
  decorators: [withRouter],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
