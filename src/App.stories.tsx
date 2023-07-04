import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import App from "./App";

const meta = {
  title: "Demo/App",
  component: App,
  // tags: ["docsPage"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {};
Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const incrementButton = canvas.getByRole("button");

  await userEvent.click(incrementButton);

  await expect(incrementButton.textContent).toContain("count is 1");
};
