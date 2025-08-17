export type ParsedSeatMap = TSeat[][];

export type TSeat = {
  type: string;
  label?: string;
  price?: number;
  status: "available" | "booked" | "blocked" | "female";
};

export const parseSeatMap = (
  seatMap: string[],
  seatTypes: {
    [key: string]: {
      price?: number;
      type: string;
    };
  },
  bookedSeats?: string[],
  blockedSeats?: string[],
  femaleSeats?: string[]
): ParsedSeatMap => {
  const parsedSeatMap: ParsedSeatMap = [];
  let seatIndex = 0;

  seatMap.forEach((row, rowIndex) => {
    const seatPattern = /[a-z_]{1}(?:\[([0-9a-z_]+)(?:,([0-9a-z_ ]+))?\])?/gi;
    const matches = row.match(seatPattern) || [];
    const seatRow: TSeat[] = [];

    matches.forEach((seat, colIndex) => {
      const seatDataPattern =
        /([a-z_]{1})(?:\[([0-9a-z_]+)(?:,([0-9a-z_ ]+))?\])?/i;
      const seatData = seat.match(seatDataPattern);

      if (seatData) {
        const char = seatData[1];
        const type = seatTypes[char]?.type ?? "space";

        if (type == "seat" || type == "berth") {
          seatRow[colIndex] = {
            type,
            label: seatData[3] ?? String(++seatIndex),
            price: seatTypes[char]?.price ?? 0,
            status: bookedSeats?.includes(seatData[3] ?? String(seatIndex))
              ? "booked"
              : blockedSeats?.includes(seatData[3] ?? String(seatIndex))
              ? "blocked"
              : femaleSeats?.includes(seatData[3] ?? String(seatIndex))
              ? "female"
              : "available",
          };
        } else {
          seatRow[colIndex] = {
            type,
            label: "",
            status: "available",
          };
        }
      }
    });

    parsedSeatMap[rowIndex] = seatRow;
  });

  return parsedSeatMap;
};
