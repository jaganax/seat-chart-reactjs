import { useCallback, useMemo, useRef } from "react";
import { parseSeatMap } from "../../utils/parse-seats";
import { Space } from "../space";
import { Door } from "../door";
import { Driver } from "../driver";
import { Berth } from "../berth";
import { Seat } from "../seat";
import { Legend } from "../legend";

type ChartProps = {
  seatMap: string[];
  seatTypes: {
    [key: string]: {
      price?: number;
      type: "seat" | "berth" | "driver" | "door";
    };
  };
  getSelectedSeats?: (seats: SelectedSeat[]) => void;
  maxSelectableSeats?: number;
  bookedSeats?: string[];
  blockedSeats?: string[];
  femaleSeats?: string[];
  legends?: {
    status: "booked" | "available" | "blocked" | "selected" | "female";
    type?: "seat" | "berth";
  }[];
};

type SelectedSeat = {
  type: string;
  label?: string;
  price?: number;
  status: "available" | "booked" | "blocked" | "female";
};

export const Chart = ({
  seatMap,
  seatTypes,
  maxSelectableSeats = 6,
  getSelectedSeats,
  bookedSeats,
  blockedSeats,
  femaleSeats,
  legends,
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
    <>
      <div className="w-fit">
        <div className="flex flex-col p-2 rounded-lg border border-gray-500 gap-2">
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
        {legends && <Legend legends={legends} />}
      </div>
    </>
  );
};
