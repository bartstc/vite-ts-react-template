import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";

import { Navbar } from "./index";

const meta: Meta<typeof Navbar> = {
  title: "Components/Layout/Navbar",
  component: Navbar,
  tags: ["docsPage"],
  decorators: [withRouter],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {};
