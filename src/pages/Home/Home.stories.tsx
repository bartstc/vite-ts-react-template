import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "storybook-addon-remix-react-router";

import { getProductsHandler } from "@/test-lib/handlers/get-products-handler";

import { homePageLoader } from "./loader";

import { Component } from "./index";

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
