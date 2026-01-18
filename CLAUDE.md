# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React component library (`@jaganax/seat-chart-reactjs`) that provides a customizable seat chart for bus, train, or event seat selection. It's published as an npm package.

## Commands

- `npm run build` - Build the library (runs TypeScript compilation and Vite build)
- `npm run lint` - Run ESLint
- `npm run storybook` - Start Storybook dev server on port 6006
- `npm run build-storybook` - Build static Storybook
- `npx vitest` - Run tests (browser-based via Playwright, uses Storybook stories)
- `npx vitest --run` - Run tests once without watch mode

## Architecture

### Entry Point
`src/index.ts` exports the main `Chart` component, types, and imports global CSS.

### Component Structure
All components are in `src/components/`:
- **Chart/** - Main component that orchestrates seat map rendering with multi-layer support
- **SeatButton/** - Unified seat/berth component with full accessibility support
- **LayoutCell/** - Driver, door, and space position indicators
- **Legend/** - Legend component for seat status colors

Each component has a corresponding `.stories.ts` file for Storybook.

### Types
`src/types/index.ts` contains all shared TypeScript types including `SeatStatus`, `SeatType`, `LayoutType`, parsed cell data types, and component props. Type guards `isParsedSeat()` and `isLayoutCell()` are provided for discriminating parsed cells.

### Hooks
`src/hooks/useSelection.ts` - Custom hook for selection state management with O(1) lookup using Set and max selection limit enforcement.

### Icons
`src/icons/` contains SVG icon components (SeatIcon, BerthIcon, DriverIcon, DoorIcon).

### Utilities
- `src/utils/parse-seats.ts` - `parseSeatMap()` converts string-based seat map notation into structured seat data
- `src/utils/cn.ts` - Tailwind class name utility

### Seat Map Notation
The notation uses:
- Single lowercase letters map to seat types defined in `seatTypes` prop
- `_` represents empty space
- `[n,label]` syntax for custom seat numbering and labeling (e.g., `a[1,R1]` creates seat with label "R1"; the first number is ignored, only the label after the comma is used)

### Multi-Layer Support
`seatMaps` prop accepts:
- `string[]` - Single layer seat map
- `Record<string, string[]>` - Multi-layer with named decks (e.g., "Lower Deck", "Upper Deck")

### Styling
Uses Tailwind CSS v4 via the `@tailwindcss/vite` plugin. Styles are compiled into `dist/index.css`. Status colors are defined as constants in `SeatButton.tsx`.

### Build Configuration
- Vite builds the library with React and Tailwind as external peer dependencies
- `vite-plugin-dts` generates TypeScript declarations
- Output: ES module (`dist/index.js`), UMD (`dist/index.umd.cjs`), types (`dist/index.d.ts`)

## Key Implementation Details

### Performance Optimizations
- All leaf components use `React.memo`
- Event handlers use `useCallback`
- Selection lookup is O(1) using Set

### Accessibility Features
- Grid pattern: `role="grid"` on chart, `role="row"` on rows, `role="gridcell"` on cells
- `aria-pressed` for selection state, `aria-disabled` for booked/blocked seats
- `aria-label` with seat info (e.g., "Seat R1, available, $100")
- Keyboard support: Tab, Enter, Space
- Focus visible indicators
