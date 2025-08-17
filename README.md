# @jaganax/seat-chart-reactjs

A flexible and customizable React.js seat chart component for bus, train, or event seat selection. Easily integrate into your React projects to visualize and interact with seat layouts, including support for seat types, legends, booking, blocking, and more.

## Features

- Render seat maps with various seat types (seat, berth, driver, door, space)
- Selectable seats with max selection limit
- Booked, blocked, and female seat support
- Custom legends for seat statuses
- Fully customizable seat map and seat types
- Built with React and Tailwind CSS

## Installation

```bash
npm install @jaganax/seat-chart-reactjs
```

Peer dependencies:

- React 19+
- React DOM 19+

## Usage

Import the `Chart` component and provide your seat map and configuration:

```jsx
import { Chart } from "@jaganax/seat-chart-reactjs";

const seatMap = [
  "____d",
  "a[1, R1]a_ss",
  "aa_ss",
  "a[1, R1]a_ss",
  "w__aa",
  // ...more rows
];

const seatTypes = {
  a: { type: "seat", price: 100 },
  s: { type: "seat", price: 100 },
  d: { type: "driver" },
  w: { type: "door" },
};

const legends = [
  { status: "booked", type: "seat" },
  { status: "available", type: "seat" },
  { status: "blocked", type: "seat" },
  { status: "selected", type: "seat" },
  { status: "female", type: "seat" },
];

function handleSelectedSeats(seats) {
  console.log("Selected seats:", seats);
}

<Chart
  seatMap={seatMap}
  seatTypes={seatTypes}
  getSelectedSeats={handleSelectedSeats}
  bookedSeats={["2", "5", "8", "R1"]}
  blockedSeats={["4", "3", "6"]}
  femaleSeats={["10"]}
  legends={legends}
  maxSelectableSeats={6}
/>;
```

## Props

| Prop                 | Type       | Description                                     |
| -------------------- | ---------- | ----------------------------------------------- |
| `seatMap`            | `string[]` | Array of strings representing seat rows         |
| `seatTypes`          | `object`   | Mapping of seat type keys to type/price         |
| `getSelectedSeats`   | `function` | Callback for selected seats                     |
| `maxSelectableSeats` | `number`   | Maximum number of selectable seats (default: 6) |
| `bookedSeats`        | `string[]` | Array of booked seat labels                     |
| `blockedSeats`       | `string[]` | Array of blocked seat labels                    |
| `femaleSeats`        | `string[]` | Array of female seat labels                     |
| `legends`            | `array`    | Array of legend objects for seat statuses       |

## Example

See the [Storybook](#) for live examples and customization options.

## License

MIT
