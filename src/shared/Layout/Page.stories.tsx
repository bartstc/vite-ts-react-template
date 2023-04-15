import { Heading, Center, Box } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { Page } from "./Page";
import { PageHeader } from "./PageHeader";

const meta = {
  component: Page,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

const Placeholder = () => (
  <Box display="stretch" border="3px dashed gray">
    <Center minH="200px">
      <Heading size="md">Placeholder</Heading>
    </Center>
  </Box>
);

export const Default: Story = {
  args: {
    children: [
      <PageHeader
        key="1"
        title="Software Frontend Developer"
        description="Specialization: JavaScript, TypeScript, React, Nextjs"
      />,
      <Placeholder key="2" />,
      <Placeholder key="3" />,
    ],
  },
};

export const WithCustomWidth: Story = {
  args: {
    ...Default.args,
    maxW: "container.md",
  },
};
