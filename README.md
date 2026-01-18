# @jaganax/seat-chart-reactjs

A flexible and customizable React.js seat chart component for bus, train, or event seat selection. Easily integrate into your React projects to visualize and interact with seat layouts, including support for seat types, legends, booking, blocking, and multi-layer seating.

## Features

- Render seat maps with various seat types (seat, berth, driver, door, space)
- Multi-layer support (e.g., lower deck/upper deck)
- Selectable seats with max selection limit
- Booked and blocked seat support
- Custom legends for seat statuses
- Full accessibility support (ARIA attributes, keyboard navigation)
- Performance optimized with React.memo
- Built with React and Tailwind CSS

## Installation

```bash
npm install @jaganax/seat-chart-reactjs
```

Peer dependencies:

- React 19+
- React DOM 19+

## Usage

### Single Layer

Import the `Chart` component and provide your seat map and configuration:

```jsx
import { Chart } from "@jaganax/seat-chart-reactjs";

const seatMaps = [
  "____d",
  "a[1,R1]a_ss",
  "aa_ss",
  "a[1,R1]a_ss",
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
  { status: "available", type: "seat" },
  { status: "booked", type: "seat" },
  { status: "blocked", type: "seat" },
  { status: "selected", type: "seat" },
];

function handleSelectionChange(seats) {
  console.log("Selected seats:", seats);
}

<Chart
  seatMaps={seatMaps}
  seatTypes={seatTypes}
  onSelectionChange={handleSelectionChange}
  bookedSeats={["2", "5", "8", "R1"]}
  blockedSeats={["4", "3", "6"]}
  legends={legends}
  maxSelectableSeats={6}
  onMaxSeatsReached={(max) => console.log(`Maximum ${max} seats allowed`)}
/>;
```

### Multi-Layer (Double Decker)

For multi-layer seating like double-decker buses:

```jsx
import { Chart } from "@jaganax/seat-chart-reactjs";

const seatMaps = {
  "Lower Deck": [
    "____d",
    "a[1,L1]a_aa",
    "aa_aa",
    "w__aa",
    "aa_aa",
  ],
  "Upper Deck": [
    "_____",
    "b[1,U1]b_bb",
    "bb_bb",
    "___bb",
    "bb_bb",
  ],
};

const seatTypes = {
  a: { type: "seat", price: 100 },
  b: { type: "berth", price: 150 },
  d: { type: "driver" },
  w: { type: "door" },
};

<Chart
  seatMaps={seatMaps}
  seatTypes={seatTypes}
  onSelectionChange={(seats) => console.log(seats)}
  bookedSeats={["L1", "U1"]}
  legends={[
    { status: "available", type: "seat" },
    { status: "available", type: "berth" },
    { status: "booked", type: "seat" },
    { status: "selected", type: "seat" },
  ]}
/>;
```

## Props

| Prop                 | Type                                   | Description                                         |
| -------------------- | -------------------------------------- | --------------------------------------------------- |
| `seatMaps`           | `string[] \| Record<string, string[]>` | Seat map array or object with named layers          |
| `seatTypes`          | `Record<string, SeatTypeConfig>`       | Mapping of seat type keys to type/price config      |
| `onSelectionChange`  | `(seats: SelectedSeat[]) => void`      | Callback when selection changes                     |
| `maxSelectableSeats` | `number`                               | Maximum number of selectable seats                  |
| `onMaxSeatsReached`  | `(maxSeats: number) => void`           | Callback when max selection limit is reached        |
| `bookedSeats`        | `string[]`                             | Array of booked seat labels                         |
| `blockedSeats`       | `string[]`                             | Array of blocked seat labels                        |
| `legends`            | `LegendItem[]`                         | Array of legend items for seat statuses             |
| `disabled`           | `boolean`                              | Disable all seat selection                          |
| `className`          | `string`                               | Additional CSS class for the chart container        |

## Types

```typescript
type SeatStatus = "available" | "booked" | "blocked";
type SeatType = "seat" | "berth";
type LayoutType = "driver" | "door" | "space";

interface SeatTypeConfig {
  type: SeatType | LayoutType;
  price?: number;
}

interface SelectedSeat {
  label: string;
  type: SeatType;
  price: number;
  status: SeatStatus;
}

interface LegendItem {
  status: SeatStatus | "selected";
  type?: SeatType;
}
```

## Seat Map Notation

- Single lowercase letters map to seat types defined in `seatTypes`
- `_` represents empty space
- `[n,label]` syntax for custom seat labeling (e.g., `a[1,R1]` starts numbering at 1 with label R1)

## Example

See the [Storybook](#) for live examples and customization options.

## Accessibility

The component includes full accessibility support:
- ARIA grid pattern for screen readers
- Keyboard navigation (Tab to enter/exit, Enter/Space to toggle)
- Focus indicators
- Descriptive labels (e.g., "Seat R1, available, $100")

## License

MIT
