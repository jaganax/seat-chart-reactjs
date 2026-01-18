// Seat statuses
export type SeatStatus = "available" | "booked" | "blocked";

// Cell types
export type SeatType = "seat" | "berth";
export type LayoutType = "driver" | "door" | "space";
export type CellType = SeatType | LayoutType;

// Parsed cell data
export interface ParsedSeat {
  type: SeatType;
  label: string;
  price: number;
  status: SeatStatus;
}

export interface ParsedLayoutCell {
  type: LayoutType;
}

export type ParsedCell = ParsedSeat | ParsedLayoutCell;

// Type guards
export function isParsedSeat(cell: ParsedCell): cell is ParsedSeat {
  return cell.type === "seat" || cell.type === "berth";
}

export function isLayoutCell(cell: ParsedCell): cell is ParsedLayoutCell {
  return cell.type === "driver" || cell.type === "door" || cell.type === "space";
}

// Selection
export interface SelectedSeat {
  label: string;
  type: SeatType;
  price: number;
  status: SeatStatus;
}

// Configuration
export interface SeatTypeConfig {
  type: CellType;
  price?: number;
}

export interface LegendItem {
  status: SeatStatus | "selected";
  type?: SeatType;
}

// Chart props
export interface ChartProps {
  /** Seat maps - either a single array or an object with named layers */
  seatMaps: string[] | Record<string, string[]>;
  /** Mapping of single characters to seat type configurations */
  seatTypes: Record<string, SeatTypeConfig>;
  /** Callback when selection changes */
  onSelectionChange?: (seats: SelectedSeat[]) => void;
  /** Maximum number of seats that can be selected (default: unlimited) */
  maxSelectableSeats?: number;
  /** Callback when max selection limit is reached */
  onMaxSeatsReached?: (maxSeats: number) => void;
  /** Array of seat labels that are booked */
  bookedSeats?: string[];
  /** Array of seat labels that are blocked */
  blockedSeats?: string[];
  /** Legend configuration */
  legends?: LegendItem[];
  /** Disable all seat selection */
  disabled?: boolean;
  /** Additional CSS class for the chart container */
  className?: string;
}

// SeatButton props
export interface SeatButtonProps {
  type: SeatType;
  label: string;
  price: number;
  status: SeatStatus;
  isSelected: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

// Legend props
export interface LegendProps {
  legends: LegendItem[];
}
