# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React component library (`@jaganax/seat-chart-reactjs`) that provides a customizable seat chart for bus, train, or event seat selection. Published as an npm package with ES module, UMD, and TypeScript declaration outputs.

## Commands

- `npm run build` - Build the library (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint (includes jsx-a11y rules)
- `npm run storybook` - Start Storybook dev server on port 6006
- `npm run build-storybook` - Build static Storybook site
- `npm test` - Run Vitest unit tests (jsdom environment)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage (thresholds enforced at 85% for branches/functions/lines/statements; `src/index.ts` is excluded from coverage)

Run a single test file:
```
npx vitest run --project unit src/hooks/useSelection.test.ts
```

### Test Configuration

All tests use Vitest, configured as two projects in `vite.config.ts`:

- **unit** — Unit tests (`src/**/*.test.{ts,tsx}`), jsdom environment, globals enabled (`describe`/`it`/`expect` available without imports). Uses `vi.fn()` / `vi.spyOn()` for mocks.
- **storybook** — Storybook interaction tests via `@storybook/addon-vitest`. Runs in headless Chromium via Playwright.

## Architecture

### Public API

`src/index.ts` exports only the `Chart` component and types: `ChartProps`, `SeatStatus`, `SeatType`, `SelectedSeat`, `LegendItem`, `SeatTypeConfig`. All internal components (SeatButton, LayoutCell, Legend, ChartLayer, ChartCell) are not exported.

### Component Hierarchy (Chart.tsx)

Chart.tsx contains three memo'd components in a single file:

- **Chart** — Parses seat maps via `parseSeatMap()`, manages selection via `useSelection()`, renders layers. Includes `aria-live` regions for selection count and max-seats-reached announcements.
- **ChartLayer** — Renders a single layer (deck). Uses flex layout for seats-only, CSS Grid for berths (`grid-row: span 2` with `display: contents` row wrappers). Integrates `useGridNavigation()` for arrow key support. Layer names render as `<h3>` headings linked via `aria-labelledby`.
- **ChartCell** — Renders individual cell: delegates to `SeatButton` for seats/berths or `LayoutCell` for driver/door/space. No ARIA roles on ChartCell itself — roles live in child components.

### Re-render Optimization Pattern

Selection uses a `useReducer` + `useRef` pattern in `useSelection.ts` to keep `toggleSelection` referentially stable (empty dependency array). The `selectedLabels: Set<string>` is passed from Chart → ChartLayer, which computes a `selected: boolean` per cell. ChartCell receives this primitive boolean, so `React.memo` correctly skips re-renders for unchanged cells — only the toggled cell re-renders, not all N cells.

`parsedLayers` memoization uses `JSON.stringify` serialized keys to handle inline objects/arrays from consumers.

### Hooks

- `src/hooks/useSelection.ts` — Selection state with `useReducer`, O(1) Set lookup, stable callbacks via `useRef`
- `src/hooks/useGridNavigation.ts` — WAI-ARIA arrow key navigation between all gridcells (including non-interactive). Roving tabindex pattern: only one cell has `tabIndex={0}`, arrow keys move focus and update tabindex. ArrowLeft/Right by index, ArrowUp/Down by spatial position via `getBoundingClientRect`.

### Types

`src/types/index.ts` — All shared types. Type guards `isParsedSeat()` and `isLayoutCell()` discriminate `ParsedCell` union. `ParsedSeat` vs `ParsedLayoutCell` determines whether a cell is interactive.

### Seat Map Notation

- Single lowercase letters map to seat types defined in `seatTypes` prop
- `_` represents empty space
- `[n,label]` syntax for custom labeling (e.g., `a[1,R1]` → label "R1")
- `seatMaps` accepts `string[]` (single layer) or `Record<string, string[]>` (multi-layer with named decks)

### Styling

Tailwind CSS v4 via `@tailwindcss/vite`. Status colors use WCAG AA-compliant darker shades in `SeatButton.tsx`: green-700 (available), gray-500 (booked), amber-700 (blocked), blue-700 (selected). Touch targets are `size-10` (40px).

### Build

Vite library mode. React and Tailwind are external peer dependencies. `vite-plugin-dts` generates rolled-up type declarations. Output: `dist/index.js` (ES), `dist/index.umd.cjs` (UMD), `dist/index.d.ts`, `dist/index.css`.

## Git Conventions

- **Pre-commit hook**: Runs `npm run lint` via Husky
- **Commit messages**: Conventional Commits enforced by commitlint (`feat:`, `fix:`, `refactor:`, etc.)

## Accessibility

### ARIA Grid Pattern
- Proper hierarchy: `role="grid"` → `role="row"` → `role="gridcell"` → `<button>` (gridcell is a wrapper div, not on the button)
- `aria-selected` on the gridcell wrapper, `aria-disabled` and `aria-label` on the button inside
- SeatButton has a `decorative` prop that suppresses grid ARIA roles (used in Legend)
- All gridcells (including layout cells) have `tabIndex={-1}` for programmatic focusability
- Space cells use `aria-label="Empty"` instead of `aria-hidden` to preserve grid column numbering

### Keyboard Navigation
- Roving tabindex: only one cell has `tabIndex={0}`, Tab enters/exits the grid, arrow keys navigate
- Enter/Space for selection
- `aria-describedby` links to sr-only instructions explaining keyboard controls

### Screen Reader Support
- `aria-live="polite"` region announces selection count changes
- `aria-live="assertive"` region announces when max seat limit is reached
- Layer names are `<h3>` headings linked to grids via `aria-labelledby`
- `priceFormatter` prop allows locale-appropriate price formatting in aria-labels (default: `$<price>`)
- `motion-reduce:transition-none` on interactive elements

### Tooling
- ESLint jsx-a11y plugin enforces accessibility rules at lint time
