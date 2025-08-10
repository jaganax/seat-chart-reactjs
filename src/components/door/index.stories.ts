import type { Meta, StoryObj } from "@storybook/react-vite";
import { Door } from ".";

const meta: Meta<typeof Door> = {
  title: "Components/Door",
  component: Door,
  tags: ["autodocs"],
} satisfies Meta<typeof Door>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
