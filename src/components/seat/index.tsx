import { useState } from "react";

type SeatProps = {
  id: string;
  label: string;
  isbooked?: boolean;
  femaleOnly?: boolean;
  clickCallBack: (label: string) => void;
};

export const Seat = ({
  id,
  label,
  isbooked,
  femaleOnly,
  clickCallBack,
}: SeatProps) => {
  const [available, setAvailable] = useState(false);

  return isbooked ? (
    <div
      id={id}
      className="relative text-center text-xs border-2 text-white rounded-sm bg-no-repeat flex items-center justify-center bg-center size-8 bg-[url('/src/assets/seat.png')] bg-gray-500 border-gray-600 cursor-not-allowed"
      aria-disabled="true"
    >
      {label}
    </div>
  ) : (
    <div
      id={id}
      className={`relative text-center text-xs border-2 text-white rounded-sm bg-no-repeat flex items-center justify-center bg-center size-8 bg-[url('/src/assets/seat.png')] cursor-pointer ${
        available
          ? "bg-blue-500 border-blue-600 hover:bg-blue-400"
          : femaleOnly
          ? "bg-pink-500 border-pink-600 hover:bg-pink-400"
          : "bg-green-500 border-green-600 hover:bg-green-400"
      }`}
      onClick={() => {
        setAvailable((prev) => !prev);
        clickCallBack("label");
      }}
    >
      {label}
    </div>
  );
};
