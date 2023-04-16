import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, screen } from "@storybook/testing-library";
import { rest } from "msw";

import { sleep } from "utils";
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

export const EmptyForm: Story = {};

export const WithCredentialsFilledByDefault: Story = {
  args: {
    initialUsername: "johndoe",
    initialPassword: "supersecret",
  },
};

export const SigningIn: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Enter credentials", async () => {
      await userEvent.type(canvas.getByLabelText(/Username/), "johndoe");
      await userEvent.type(canvas.getByLabelText(/Password/), "supersecret");
    });

    await step("Submit form", async () => {
      await sleep(500);

      await userEvent.click(canvas.getByRole("button", { name: "Sign in" }));
    });

    expect(
      await screen.findByText("Logged in successfully.")
    ).toBeInTheDocument();
  },
};
