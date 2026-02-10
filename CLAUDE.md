# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React component library (`@jaganax/seat-chart-reactjs`) that provides a customizable seat chart for bus, train, or event seat selection. Published as an npm package with ES module, UMD, and TypeScript declaration outputs.

## Commands

- `npm run build` - Build the library (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint (includes jsx-a11y rules)
- `npm run storybook` - Start Storybook dev server on port 6006
- `npm test` - Run Jest tests (uses jsdom, requires `--experimental-vm-modules`)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage (thresholds enforced at 85%)

Run a single test file:
```
node --experimental-vm-modules node_modules/jest/bin/jest.js src/hooks/useSelection.test.ts
```

## Architecture

### Public API

`src/index.ts` exports only the `Chart` component and types: `ChartProps`, `SeatStatus`, `SeatType`, `SelectedSeat`, `LegendItem`, `SeatTypeConfig`. All internal components (SeatButton, LayoutCell, Legend, ChartLayer, ChartCell) are not exported.

### Component Hierarchy (Chart.tsx)

Chart.tsx contains three memo'd components in a single file:

- **Chart** — Parses seat maps via `parseSeatMap()`, manages selection via `useSelection()`, renders layers
- **ChartLayer** — Renders a single layer (deck). Uses flex layout for seats-only, CSS Grid for berths (`grid-row: span 2`). Integrates `useGridNavigation()` for arrow key support.
- **ChartCell** — Renders individual cell: delegates to `SeatButton` for seats/berths or `LayoutCell` for driver/door/space

### Re-render Optimization Pattern

Selection uses a `useReducer` + `useRef` pattern in `useSelection.ts` to keep `toggleSelection` referentially stable (empty dependency array). The `selectedLabels: Set<string>` is passed from Chart → ChartLayer, which computes a `selected: boolean` per cell. ChartCell receives this primitive boolean, so `React.memo` correctly skips re-renders for unchanged cells — only the toggled cell re-renders, not all N cells.

`parsedLayers` memoization uses `JSON.stringify` serialized keys to handle inline objects/arrays from consumers.

### Hooks

- `src/hooks/useSelection.ts` — Selection state with `useReducer`, O(1) Set lookup, stable callbacks via `useRef`
- `src/hooks/useGridNavigation.ts` — WAI-ARIA arrow key navigation between interactive gridcells. ArrowLeft/Right by index, ArrowUp/Down by spatial position via `getBoundingClientRect`.

### Types

`src/types/index.ts` — All shared types. Type guards `isParsedSeat()` and `isLayoutCell()` discriminate `ParsedCell` union. `ParsedSeat` vs `ParsedLayoutCell` determines whether a cell is interactive.

### Seat Map Notation

- Single lowercase letters map to seat types defined in `seatTypes` prop
- `_` represents empty space
- `[n,label]` syntax for custom labeling (e.g., `a[1,R1]` → label "R1")
- `seatMaps` accepts `string[]` (single layer) or `Record<string, string[]>` (multi-layer with named decks)

### Styling

Tailwind CSS v4 via `@tailwindcss/vite`. Status colors defined as constants in `SeatButton.tsx`: green (available), gray (booked), amber (blocked), blue (selected).

### Build

Vite library mode. React and Tailwind are external peer dependencies. `vite-plugin-dts` generates rolled-up type declarations. Output: `dist/index.js` (ES), `dist/index.umd.cjs` (UMD), `dist/index.d.ts`, `dist/index.css`.

## Git Conventions

- **Pre-commit hook**: Runs `npm run lint` via Husky
- **Commit messages**: Conventional Commits enforced by commitlint (`feat:`, `fix:`, `refactor:`, etc.)

## Accessibility

- WAI-ARIA grid pattern: `role="grid"` → `role="row"` → `role="gridcell"`
- `aria-selected` for selection state, `aria-disabled` for booked/blocked seats
- `aria-label` with seat info (e.g., "Seat R1, available, $100")
- Keyboard: Tab, Enter, Space for selection; Arrow keys for grid navigation
- ESLint jsx-a11y plugin enforces accessibility rules at lint time
