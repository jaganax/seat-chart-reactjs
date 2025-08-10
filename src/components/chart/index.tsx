import { useCallback, useMemo, useState } from "react";
import { parseSeatMap } from "../../utils/parse-seats";
import { Space } from "../space";
import { Door } from "../door";
import { Driver } from "../driver";
import { Berth } from "../berth";
import { Seat } from "../seat";

export const Chart = ({
  seatMap,
  seatTypes,
}: {
  seatMap: string[];
  seatTypes: { [key: string]: { price: number; type: string } };
}) => {
  const [, setSelectedSeats] = useState<string[]>([]);
  const parsedSeatMap = useMemo(
    () => parseSeatMap(seatMap, seatTypes),
    [seatMap, seatTypes]
  );

  const handleSeatClick = useCallback(
    (id: string) => {
      setSelectedSeats((prev: string[]) =>
        prev.includes(id)
          ? prev.filter((id: string) => id !== id)
          : [...prev, id]
      );
    },
    [setSelectedSeats]
  );

  return (
    <div className="flex flex-col p-2 rounded-lg border border-gray-500 w-fit gap-2">
      {parsedSeatMap.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="flex justify-center gap-2 h-8">
            {row.map((seat, colIndex) => {
              switch (seat.type) {
                case "space":
                  return <Space key={colIndex} />;
                case "door":
                  return <Door key={colIndex} />;
                case "driver":
                  return <Driver key={colIndex} />;
                case "berth":
                  return (
                    <Berth
                      key={colIndex}
                      id="1"
                      label="01"
                      clickCallBack={handleSeatClick}
                    />
                  );
                default:
                  return (
                    <Seat
                      key={colIndex}
                      id="1"
                      label="01"
                      clickCallBack={handleSeatClick}
                    />
                  );
              }
            })}
          </div>
        );
      })}
    </div>
  );
};
