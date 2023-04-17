import type { Meta, StoryObj } from "@storybook/react";

import { Radio } from "./Radio";
import { RadioGroup } from "./RadioGroup";

const meta = {
  title: "shared/Form/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "1",
    children: [
      <Radio key="1" value="1">
        1
      </Radio>,
      <Radio key="2" value="2">
        2
      </Radio>,
      <Radio key="3" value="3">
        3
      </Radio>,
    ],
  },
};

export const InColumn: Story = {
  args: {
    ...Default.args,
    direction: "column",
  },
};

export const InRow: Story = {
  args: {
    ...Default.args,
    direction: "row",
  },
};
