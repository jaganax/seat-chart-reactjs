import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chart } from ".";

const meta: Meta<typeof Chart> = {
  title: "Components/Chart",
  component: Chart,
  tags: ["autodocs"],
} satisfies Meta<typeof Chart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    seatMap: [
      "____d",
      "a[1, R1]a_ss",
      "aa_ss",
      "a[1, R1]a_ss",
      "w__aa",
      "a[1, R1]a_ss",
      "a[1, R1]a_aa",
      "a[1, R1]a_aa",
      "a[1, R1]a_aa",
      "a[1, R1]a_aa",
    ],
    seatTypes: {
      a: { type: "seat", price: 100 },
      s: { type: "seat", price: 100 },
      d: { type: "driver" },
      w: { type: "door" },
    },
    getSelectedSeats: (seats) => {
      console.log("selected seats:", seats);
    },
    bookedSeats: ["2", "5", "8", "R1"],
    blockedSeats: ["4", "3", "6"],
    femaleSeats: ["10"],
    legends: [
      { status: "booked", type: "seat" },
      { status: "available", type: "seat" },
      { status: "blocked", type: "seat" },
      { status: "selected", type: "seat" },
      { status: "female", type: "seat" },
    ],
  },
};
