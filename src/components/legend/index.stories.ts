import type { Meta, StoryObj } from "@storybook/react-vite";
import { Legend } from ".";

const meta: Meta<typeof Legend> = {
  title: "Components/Legend",
  component: Legend,
  tags: ["autodocs"],
} satisfies Meta<typeof Legend>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    legends: [
      { status: "booked", type: "seat" },
      { status: "available", type: "seat" },
      { status: "blocked", type: "seat" },
      { status: "selected", type: "seat" },
      { status: "female", type: "seat" },
    ],
  },
};
