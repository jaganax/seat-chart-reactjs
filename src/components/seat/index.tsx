import { useState } from "react";

type SeatProps = {
  id: string;
  label: string;
  price?: number;
  type?: string;
  isBooked?: boolean;
  isBlocked?: boolean;
  femaleOnly?: boolean;
  clickCallBack: () => boolean;
};

export const Seat = ({
  id,
  label,
  isBooked,
  isBlocked,
  femaleOnly,
  clickCallBack,
}: SeatProps) => {
  const [available, setAvailable] = useState(false);

  return isBooked ? (
    <div
      id={id}
      className="relative select-none text-xs text-white rounded-xs size-8 flex items-center justify-center cursor-not-allowed bg-gray-500 border-gray-600"
    >
      {label}
    </div>
  ) : isBlocked ? (
    <div
      id={id}
      className="relative select-none text-xs text-white rounded-xs size-8 flex items-center justify-center cursor-not-allowed bg-red-500 border-red-600"
    >
      {label}
    </div>
  ) : (
    <div
      id={id}
      className={`relative select-none text-xs text-white rounded-xs size-8 flex items-center justify-center cursor-pointer ${
        available
          ? "bg-blue-500 border-blue-600 hover:bg-blue-400"
          : femaleOnly
          ? "bg-pink-500 border-pink-600 hover:bg-pink-400"
          : "bg-green-500 border-green-600 hover:bg-green-400"
      }`}
      onClick={() => {
        if (clickCallBack()) {
          setAvailable((prev) => !prev);
        } else {
          alert(`Reached maximum allowed seats per booking`);
        }
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="absolute"
      >
        <g>
          <path
            transform="rotate(90 50 50)"
            d="m87.7,11.59949c-0.8,-3.78381 -4.1,-6.74949 -8.2,-6.74949l-42.6,0c-4,0 -7.4,2.86342 -8.2,6.64723l-17,0c-3.7,0.10227 -6.7,3.06795 -6.7,6.85176l0,63.09751c0,3.78381 3,6.74949 6.7,6.74949l16.9,0c0.7,3.98834 4.1,6.95402 8.2,6.95402l42.7,0c3.8,0 7,-2.55663 8,-5.93137c4.2,-0.40906 7.5,-3.98834 7.5,-8.38573l0,-60.94994c0,-4.19287 -3.2,-7.77214 -7.3,-8.28347l0,-0.00001zm-50.8,-3.78381l42.7,0c2.5,0 4.5,1.63624 5.2,3.88607c-3.3,0.81812 -5.8,3.57928 -6.3,6.95402l-41.6,0c-3,0 -5.4,-2.45436 -5.4,-5.42005s2.4,-5.42005 5.4,-5.42005l0,0.00001zm-8.2,77.41461l-17,0c-2.1,0 -3.8,-1.73851 -3.8,-3.78381l0,-63.09751c0,-2.14757 1.7,-3.78381 3.8,-3.78381l16.9,0c0.6,4.0906 4.1,7.15855 8.2,7.15855l41.4,0l0,56.75708l-41.3,0c-4.1,-0.10227 -7.5,2.86342 -8.2,6.74949l0,0.00001zm50.8,7.05629l-42.6,0c-3,0 -5.4,-2.45436 -5.4,-5.42005s2.4,-5.42005 5.4,-5.42005l41.5,0c0.2,3.68154 2.8,6.64723 6.2,7.56761c-0.9,1.84077 -2.8,3.27248 -5.1,3.27248l0,0.00001zm12.6,-11.45368c0,2.96569 -2.4,5.42005 -5.4,5.42005s-5.4,-2.45436 -5.4,-5.42005l0,-60.94994c0,-2.96569 2.4,-5.42005 5.4,-5.42005s5.4,2.45436 5.4,5.42005l0,60.94994z"
          />
        </g>
      </svg>
      {label}
    </div>
  );
};
