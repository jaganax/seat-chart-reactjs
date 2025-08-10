import type { Meta, StoryObj } from "@storybook/react-vite";
import { Driver } from ".";

const meta: Meta<typeof Driver> = {
  title: "Components/Driver",
  component: Driver,
  tags: ["autodocs"],
} satisfies Meta<typeof Driver>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
