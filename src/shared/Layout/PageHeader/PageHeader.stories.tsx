import { EmailIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { PageHeader } from "./index";

const meta: Meta<typeof PageHeader> = {
  title: "Components/Layout/PageHeader",
  component: PageHeader,
  tags: ["docsPage"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "Software Frontend Developer",
    description: "Specialization: JavaScript, TypeScript, React, Nextjs",
    children: (
      <>
        <Button
          colorScheme="blue"
          variant="outline"
          leftIcon={<ExternalLinkIcon />}
        >
          See profile
        </Button>
        <Button colorScheme="blue" leftIcon={<EmailIcon />}>
          Contact
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
