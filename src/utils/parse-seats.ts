import type {
  ParsedCell,
  ParsedSeat,
  ParsedLayoutCell,
  SeatStatus,
  SeatTypeConfig,
} from "../types";

export type ParsedSeatMap = ParsedCell[][];

export interface ParseSeatMapResult {
  seatMap: ParsedSeatMap;
  /** The next seat index (for continuing numbering across layers) */
  nextIndex: number;
}

/**
 * Parse a seat map string array into structured cell data.
 *
 * Seat map notation:
 * - Single lowercase letter maps to a seat type in seatTypes config
 * - `_` represents empty space
 * - `[n]` or `[n, label]` syntax for custom seat numbering/labeling
 *   Example: `a[1, R1]` creates a seat with label "R1"
 */
export function parseSeatMap(
  seatMap: string[],
  seatTypes: Record<string, SeatTypeConfig>,
  bookedSeats: string[] = [],
  blockedSeats: string[] = [],
  startIndex: number = 0
): ParseSeatMapResult {
  const parsedSeatMap: ParsedSeatMap = [];
  let seatIndex = startIndex;

  const bookedSet = new Set(bookedSeats);
  const blockedSet = new Set(blockedSeats);

  for (let rowIndex = 0; rowIndex < seatMap.length; rowIndex++) {
    const row = seatMap[rowIndex];
    const seatPattern = /[a-z_](?:\[([0-9a-z_]+)(?:,([0-9a-z_ ]+))?\])?/gi;
    const matches = row.match(seatPattern) || [];
    const seatRow: ParsedCell[] = [];

    for (let colIndex = 0; colIndex < matches.length; colIndex++) {
      const seat = matches[colIndex];
      const seatDataPattern =
        /([a-z_])(?:\[([0-9a-z_]+)(?:,([0-9a-z_ ]+))?\])?/i;
      const seatData = seat.match(seatDataPattern);

      if (seatData) {
        const char = seatData[1];
        const config = seatTypes[char];
        const type = config?.type ?? "space";

        if (type === "seat" || type === "berth") {
          const label = seatData[3]?.trim() ?? String(++seatIndex);
          const status = getStatus(label, bookedSet, blockedSet);

          const parsedSeat: ParsedSeat = {
            type,
            label,
            price: config?.price ?? 0,
            status,
          };
          seatRow.push(parsedSeat);
        } else {
          const layoutCell: ParsedLayoutCell = { type };
          seatRow.push(layoutCell);
        }
      }
    }

    parsedSeatMap.push(seatRow);
  }

  return { seatMap: parsedSeatMap, nextIndex: seatIndex };
}

function getStatus(
  label: string,
  bookedSet: Set<string>,
  blockedSet: Set<string>
): SeatStatus {
  if (bookedSet.has(label)) return "booked";
  if (blockedSet.has(label)) return "blocked";
  return "available";
}
