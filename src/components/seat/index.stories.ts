import type { Meta, StoryObj } from "@storybook/react-vite";
import { Seat } from ".";

const meta: Meta<typeof Seat> = {
  title: "Components/Seat",
  component: Seat,
  tags: ["autodocs"],
} satisfies Meta<typeof Seat>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "1",
    label: "99",
    isbooked: false,
    femaleOnly: false,
  },
};
