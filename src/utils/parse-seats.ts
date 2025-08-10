export type ParsedSeatMap = TSeat[][];

export type TSeat = {
  id: string;
  label: string;
  type: string;
  price: number;
  available?: boolean;
  femaleOnly?: boolean;
};

export const parseSeatMap = (
  seatMap: string[],
  seatTypes: {
    [key: string]: {
      price: number;
      type: string;
    };
  }
): ParsedSeatMap => {
  const parsedSeatMap: ParsedSeatMap = [];
  let seatIndex = 0;

  seatMap.forEach((row, rowIndex) => {
    const seatPattern = /[a-z_]{1}(?:\[([0-9a-z_]+)(?:,([0-9a-z_ ]+))?\])?/gi;
    const matches = row.match(seatPattern) || [];
    parsedSeatMap[rowIndex] = new Array(matches.length);

    matches.forEach((seat, colIndex) => {
      const seatDataPattern =
        /([a-z_]{1})(?:\[([0-9a-z_]+)(?:,([0-9a-z_ ]+))?\])?/i;
      const seatData = seat.match(seatDataPattern);

      if (seatData) {
        const char = seatData[1];
        const id = seatData[2] || String(++seatIndex);
        const label = seatData[3] || String(seatIndex);
        const price = seatTypes[char]?.price || 0;
        const type = seatTypes[char]?.type || "space";

        parsedSeatMap[rowIndex][colIndex] = {
          id,
          label,
          price,
          type,
        };
      }
    });
  });

  return parsedSeatMap;
};
