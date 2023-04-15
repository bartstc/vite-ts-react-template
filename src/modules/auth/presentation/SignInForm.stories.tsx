import type { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";

import { host } from "utils/http";

import { SignInForm } from "./SignInForm";

const meta = {
  title: "modules/Auth/SignInForm",
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
} satisfies Meta<typeof SignInForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFilledFormByDefault: Story = {
  args: {
    initialUsername: "johndoe",
    initialPassword: "supersecret",
  },
};
