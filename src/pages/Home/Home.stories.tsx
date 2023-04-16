import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";

import { getProductsHandler } from "utils";

import { Component } from "./index";
import { homePageLoader } from "./loader";

const meta = {
  title: "pages/Home",
  component: Component,
  parameters: {
    layout: "centered",
    reactRouter: {
      loader: homePageLoader,
    },
  },
  decorators: [withRouter],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [getProductsHandler()],
    },
  },
};
