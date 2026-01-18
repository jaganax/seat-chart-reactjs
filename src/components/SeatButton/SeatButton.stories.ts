import type { Meta, StoryObj } from "@storybook/react-vite";
import { SeatButton } from "./SeatButton";

const meta: Meta<typeof SeatButton> = {
  title: "Components/SeatButton",
  component: SeatButton,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["available", "booked", "blocked"],
    },
    type: {
      control: "select",
      options: ["seat", "berth"],
    },
  },
} satisfies Meta<typeof SeatButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AvailableSeat: Story = {
  args: {
    type: "seat",
    label: "1",
    price: 100,
    status: "available",
    isSelected: false,
    onClick: () => console.log("Clicked"),
  },
};

export const SelectedSeat: Story = {
  args: {
    type: "seat",
    label: "2",
    price: 100,
    status: "available",
    isSelected: true,
    onClick: () => console.log("Clicked"),
  },
};

export const BookedSeat: Story = {
  args: {
    type: "seat",
    label: "3",
    price: 100,
    status: "booked",
    isSelected: false,
  },
};

export const BlockedSeat: Story = {
  args: {
    type: "seat",
    label: "4",
    price: 100,
    status: "blocked",
    isSelected: false,
  },
};

export const AvailableBerth: Story = {
  args: {
    type: "berth",
    label: "L1",
    price: 200,
    status: "available",
    isSelected: false,
    onClick: () => console.log("Clicked"),
  },
};

export const SelectedBerth: Story = {
  args: {
    type: "berth",
    label: "L2",
    price: 200,
    status: "available",
    isSelected: true,
    onClick: () => console.log("Clicked"),
  },
};
