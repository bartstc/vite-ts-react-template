import { Button } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExternalLink, Mail } from "lucide-react";

import { PageHeader } from "./PageHeader";

const meta = {
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Software Frontend Developer",
    description: "Specialization: JavaScript, TypeScript, React, Nextjs",
    children: (
      <>
        <Button colorPalette="blue" variant="outline">
          <ExternalLink />
          {"See profile"}
        </Button>
        <Button colorPalette="blue">
          <Mail />
          {"Contact"}
        </Button>
      </>
    ),
  },
};

export const SmSize: Story = {
  args: {
    ...Default.args,
    size: "sm",
  },
};

export const MdSize: Story = {
  args: {
    ...Default.args,
    size: "md",
  },
};

export const LgSize: Story = {
  args: {
    ...Default.args,
    size: "lg",
  },
};

export const XlSize: Story = {
  args: {
    ...Default.args,
    size: "xl",
  },
};
