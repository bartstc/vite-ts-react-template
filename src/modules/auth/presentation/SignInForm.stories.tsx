import type { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";

import { host } from "utils/http";

import { SignInForm } from "./SignInForm";

const meta: Meta<typeof SignInForm> = {
  title: "Modules/Auth/SignInForm",
  component: SignInForm,
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
};

export default meta;
type Story = StoryObj<typeof SignInForm>;

export const Default: Story = {};
