import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutCell } from "./LayoutCell";

const meta: Meta<typeof LayoutCell> = {
  title: "Components/LayoutCell",
  component: LayoutCell,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["driver", "door", "space"],
    },
  },
} satisfies Meta<typeof LayoutCell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Driver: Story = {
  args: {
    type: "driver",
  },
};

export const Door: Story = {
  args: {
    type: "door",
  },
};

export const Space: Story = {
  args: {
    type: "space",
  },
};
