import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, screen, expect } from "storybook/test";

import { postSignInHandler } from "@/test-lib/handlers/post-sign-in-handler";

import { SignInForm } from "./SignInForm";

const meta = {
  title: "modules/Auth/SignInForm",
  component: SignInForm,
  parameters: {
    layout: "centered",
    msw: {
      handlers: [postSignInHandler()],
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
  play: async ({ canvas, step }) => {
    await step("Enter credentials", async () => {
      await userEvent.type(canvas.getByLabelText(/Username/), "johndoe");
      await userEvent.type(canvas.getByLabelText(/Password/), "supersecret");
    });

    await step("Submit form", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Sign in" }));
      await expect(
        await screen.findByText("Successfully signed in!")
      ).toBeInTheDocument();
    });
  },
};
