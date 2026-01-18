import type { Meta, StoryObj } from "@storybook/react-vite";
import { Legend } from "./Legend";

const meta: Meta<typeof Legend> = {
  title: "Components/Legend",
  component: Legend,
  tags: ["autodocs"],
} satisfies Meta<typeof Legend>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SeatLegend: Story = {
  args: {
    legends: [
      { status: "available", type: "seat" },
      { status: "booked", type: "seat" },
      { status: "blocked", type: "seat" },
      { status: "selected", type: "seat" },
    ],
  },
};

export const BerthLegend: Story = {
  args: {
    legends: [
      { status: "available", type: "berth" },
      { status: "booked", type: "berth" },
      { status: "blocked", type: "berth" },
      { status: "selected", type: "berth" },
    ],
  },
};

export const MixedLegend: Story = {
  args: {
    legends: [
      { status: "available", type: "seat" },
      { status: "available", type: "berth" },
      { status: "booked", type: "seat" },
      { status: "selected", type: "seat" },
    ],
  },
};
