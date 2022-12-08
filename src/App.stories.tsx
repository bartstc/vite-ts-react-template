import React from "react";

import { expect } from "@storybook/jest";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import App from "./App";

export default {
  title: "demo/App",
  component: App,
} as ComponentMeta<typeof App>;

export const Default: ComponentStory<typeof App> = () => <App />;

export const Interactive: ComponentStory<typeof App> = () => <App />;
Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const incrementButton = canvas.getByRole("button");

  await userEvent.click(incrementButton);

  await expect(incrementButton).toHaveTextContent("count is 1");
};
