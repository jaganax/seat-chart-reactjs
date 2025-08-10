import type { Meta, StoryObj } from "@storybook/react-vite";
import { Space } from ".";

const meta: Meta<typeof Space> = {
  title: "Components/Space",
  component: Space,
  tags: ["autodocs"],
} satisfies Meta<typeof Space>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
