import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import { Demo } from "./Demo";

const meta: Meta<typeof Demo> = {
  title: "modules/Demo",
  component: Demo,
  tags: ["docsPage"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Demo>;

export const Default: Story = {};

export const Interactive: Story = {};
Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const incrementButton = canvas.getByRole("button");

  await userEvent.click(incrementButton);

  await expect(incrementButton).toHaveTextContent("count is 1");
};
