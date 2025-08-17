export type ParsedSeatMap = TSeat[][];

export type TSeat = {
  id: string;
  label: string;
  type: string;
  price: number;
  isBooked: boolean;
  isBlocked: boolean;
  femaleOnly: boolean;
};

export const parseSeatMap = (
  seatMap: string[],
  seatTypes: {
    [key: string]: {
      price: number;
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
            id: (seatData[2] && String(++seatIndex)) ?? String(++seatIndex),
            type,
            label: seatData[3] ?? String(seatIndex),
            price: seatTypes[char]?.price ?? 0,
            isBooked:
              bookedSeats?.includes(seatData[3] ?? String(seatIndex)) ?? false,
            isBlocked:
              blockedSeats?.includes(seatData[3] ?? String(seatIndex)) ?? false,
            femaleOnly:
              femaleSeats?.includes(seatData[3] ?? String(seatIndex)) ?? false,
          };
        } else {
          seatRow[colIndex] = {
            id: "",
            label: "",
            type,
            price: 0,
            isBooked: false,
            isBlocked: false,
            femaleOnly: false,
          };
        }
      }
    });

    parsedSeatMap[rowIndex] = seatRow;
  });

  return parsedSeatMap;
};
