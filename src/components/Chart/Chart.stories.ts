import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chart } from "./Chart";

const meta: Meta<typeof Chart> = {
  title: "Components/Chart",
  component: Chart,
  tags: ["autodocs"],
} satisfies Meta<typeof Chart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BusLayout: Story = {
  args: {
    seatMaps: [
      "____d",
      "a[1,R1]a_ss",
      "aa_ss",
      "a[1,R1]a_ss",
      "w__aa",
      "a[1,R1]a_aa",
      "a[1,R1]a_aa",
      "a[1,R1]a_aa",
      "a[1,R1]a_aa",
      "a[1,R1]a_aa",
    ],
    seatTypes: {
      a: { type: "seat", price: 100 },
      s: { type: "seat", price: 100 },
      d: { type: "driver" },
      w: { type: "door" },
    },
    onSelectionChange: (seats) => {
      console.log("Selected seats:", seats);
    },
    bookedSeats: ["2", "5", "8", "R1"],
    blockedSeats: ["4", "3", "6"],
    legends: [
      { status: "available", type: "seat" },
      { status: "booked", type: "seat" },
      { status: "blocked", type: "seat" },
      { status: "selected", type: "seat" },
    ],
  },
};

export const SleeperBus: Story = {
  args: {
    seatMaps: [
      "____d",
      "b[1,L1]b_bb",
      "bb_bb",
      "bb_bb",
      "w__bb",
      "bb_bb",
      "bb_bb",
    ],
    seatTypes: {
      b: { type: "berth", price: 200 },
      d: { type: "driver" },
      w: { type: "door" },
    },
    bookedSeats: ["L1", "4"],
    blockedSeats: ["6"],
    legends: [
      { status: "available", type: "berth" },
      { status: "booked", type: "berth" },
      { status: "blocked", type: "berth" },
      { status: "selected", type: "berth" },
    ],
  },
};

export const DisabledChart: Story = {
  args: {
    seatMaps: ["aaa", "aaa", "aaa"],
    seatTypes: {
      a: { type: "seat", price: 50 },
    },
    disabled: true,
  },
};

export const NoLegend: Story = {
  args: {
    seatMaps: ["aaa", "aaa", "aaa"],
    seatTypes: {
      a: { type: "seat", price: 50 },
    },
  },
};

export const MultiLayerSleeperBus: Story = {
  args: {
    seatMaps: {
      "Lower Deck": [
        "____d",
        "b[1,L1]__aa",
        "___aa",
        "b__aa",
        "___aa",
        "w__aa",
        "b__aa",
        "___aa",
        "b__aa",
        "___aa",
      ],
      "Upper Deck": [
        "_____",
        "b[1,U1]b_bb",
        "_____",
        "bb_bb",
        "_____",
        "bb_bb",
        "_____",

        "___bb",
        "_____",
        "bb_bb",
        "_____",
        "bb_bb",
        "_____",
      ],
    },
    seatTypes: {
      a: { type: "seat", price: 100 },
      b: { type: "berth", price: 150 },
      d: { type: "driver" },
      w: { type: "door" },
    },
    maxSelectableSeats: 6,
    onSelectionChange: (seats) => {
      console.log("Selected seats:", seats);
    },
    bookedSeats: ["L1", "U1", "4"],
    blockedSeats: ["6"],
    legends: [
      { status: "available", type: "seat" },
      { status: "available", type: "berth" },
      { status: "booked", type: "seat" },
      { status: "blocked", type: "seat" },
      { status: "selected", type: "seat" },
    ],
  },
};
