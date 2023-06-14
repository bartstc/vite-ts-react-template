import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, screen } from "@storybook/testing-library";

import { getSignInHandler, sleep } from "utils";

import { SignInForm } from "./SignInForm";

const meta = {
  title: "modules/Auth/SignInForm",
  component: SignInForm,
  parameters: {
    layout: "centered",
    msw: {
      handlers: [getSignInHandler()],
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
      await sleep(500);
    });

    expect(
      await screen.findByText("Logged in successfully.")
    ).toBeInTheDocument();
  },
};
