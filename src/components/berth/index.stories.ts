import type { Meta, StoryObj } from "@storybook/react-vite";
import { Berth } from ".";

const meta: Meta<typeof Berth> = {
  title: "Components/Berth",
  component: Berth,
  tags: ["autodocs"],
} satisfies Meta<typeof Berth>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "1",
    label: "L04",
    isbooked: false,
    femaleOnly: false,
  },
};
