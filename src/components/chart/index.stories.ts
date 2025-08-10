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
      "___ss",
      "a[1, R1]a_ss",
      "w__aa",
      "a[1, R1]a_ss",
      "a[1, R1]a_aa",
      "a[1, R1]a_aa",
      "a[1, R1]a_aa",
      "a[1, R1]a_aa",
    ],
    seatTypes: {
      a: { price: 100, type: "berth" },
      s: { price: 100, type: "seat" },
      d: { price: 150, type: "driver" },
      w: { price: 0, type: "door" },
    },
  },
};
