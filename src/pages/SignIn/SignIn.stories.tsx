import type { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { withRouter } from "storybook-addon-react-router-v6";

import { host } from "utils/http";

import { SignInPage as Component } from "./index";

const meta = {
  title: "pages/SignIn",
  component: Component,
  parameters: {
    layout: "centered",
    msw: {
      handlers: [
        rest.post(`${host}/auth/login`, (req, res, ctx) => {
          return res(ctx.json({ token: "token" }));
        }),
      ],
    },
  },
  decorators: [withRouter],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
