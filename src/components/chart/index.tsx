import { useCallback, useMemo, useRef } from "react";
import { parseSeatMap } from "../../utils/parse-seats";
import { Space } from "../space";
import { Door } from "../door";
import { Driver } from "../driver";
import { Berth } from "../berth";
import { Seat } from "../seat";

type ChartProps = {
  seatMap: string[];
  seatTypes: {
    [key: string]: {
      price: number;
      type: "seat" | "berth" | "driver" | "door" | "space";
    };
  };
  getSelectedSeats?: (seats: SelectedSeat[]) => void;
  maxSelectableSeats?: number;
  bookedSeats?: string[];
  blockedSeats?: string[];
  femaleSeats?: string[];
};

type SelectedSeat = {
  label: string;
  price: number;
};

export const Chart = ({
  seatMap,
  seatTypes,
  maxSelectableSeats = 6,
  getSelectedSeats,
  bookedSeats,
  blockedSeats,
  femaleSeats,
}: ChartProps) => {
  const selectedSeats = useRef<SelectedSeat[]>([]);
  const parsedSeatMap = useMemo(
    () =>
      parseSeatMap(seatMap, seatTypes, bookedSeats, blockedSeats, femaleSeats),
    [blockedSeats, bookedSeats, femaleSeats, seatMap, seatTypes]
  );

  const handleSeatClick = useCallback(
    (seat: SelectedSeat) => {
      const prevId = selectedSeats.current.findIndex(
        (prev) => prev.label === seat.label
      );

      if (prevId !== -1) {
        selectedSeats.current.splice(prevId, 1);
      } else {
        if (maxSelectableSeats <= selectedSeats.current.length) {
          return false;
        }
        selectedSeats.current.push(seat);
      }

      if (getSelectedSeats) getSelectedSeats(selectedSeats.current);

      return true;
    },
    [getSelectedSeats, maxSelectableSeats]
  );

  return (
    <div className="flex flex-col p-2 rounded-lg border border-gray-500 w-fit gap-2">
      {parsedSeatMap.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="flex justify-center gap-2">
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
                      {...seat}
                      clickCallBack={() => handleSeatClick(seat)}
                    />
                  );
                default:
                  return (
                    <Seat
                      key={colIndex}
                      {...seat}
                      clickCallBack={() => handleSeatClick(seat)}
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
