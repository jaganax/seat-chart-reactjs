import { useLayoutEffect, useState } from "react";

type BerthProps = {
  label?: string;
  status: "booked" | "available" | "blocked" | "female" | "selected";
  clickCallBack?: () => void;
};

export const Berth = ({ label = "L4", status, clickCallBack }: BerthProps) => {
  const [selected, setSelected] = useState(status == "selected");

  useLayoutEffect(() => {
    setSelected(status == "selected");
  }, [status]);

  return status === "booked" ? (
    <div className="relative select-none text-xs text-white rounded-xs w-8 h-16 flex items-center justify-center [writing-mode:vertical-rl] cursor-not-allowed bg-gray-500 border-gray-600">
      {label}
    </div>
  ) : status === "blocked" ? (
    <div className="relative select-none text-xs text-white rounded-xs w-8 h-16 flex items-center justify-center [writing-mode:vertical-rl] cursor-not-allowed bg-amber-500 border-amber-600">
      {label}
    </div>
  ) : (
    <div
      className={`relative select-none text-xs text-white rounded-xs w-8 h-16 flex items-center justify-center [writing-mode:vertical-rl] cursor-pointer ${
        selected
          ? "bg-blue-500 border-blue-600 hover:bg-blue-400"
          : status == "female"
          ? "bg-pink-500 border-pink-600 hover:bg-pink-400"
          : "bg-green-500 border-green-600 hover:bg-green-400"
      }`}
      onClick={() => {
        if (clickCallBack) {
          clickCallBack();
          setSelected((prev) => !prev);
        }
      }}
    >
      <svg
        viewBox="0 0 64 128"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
      >
        <g>
          <path d="m10.85,15.1l0,3.1c0,3.5 2.8,6.3 6.3,6.3l29.7,0c3.5,0 6.3,-2.8 6.3,-6.3l0,-3.1c0,-3.5 -2.8,-6.3 -6.3,-6.3l-29.7,0c-3.4,0 -6.3,2.8 -6.3,6.3zm36.1,-4.4c2.4,0 4.4,2 4.4,4.4l0,3.1c0,2.4 -2,4.4 -4.4,4.4l-29.8,0c-2.4,0 -4.4,-2 -4.4,-4.4l0,-3.1c0,-2.4 2,-4.4 4.4,-4.4l29.8,0z" />
          <path d="m3.1,9.77777l0,108.44445c0,3.79556 2.36357,6.77777 5.37175,6.77777l47.0565,0c3.00818,0 5.37175,-2.98223 5.37175,-6.77777l0,-108.44445c0,-3.79556 -2.36357,-6.77777 -5.37175,-6.77777l-47.0565,0c-2.90074,0 -5.37175,2.98223 -5.37175,6.77777zm52.42825,-4.20223c1.82639,0 3.33048,1.89777 3.33048,4.20223l0,108.44445c0,2.30444 -1.50409,4.20223 -3.33048,4.20223l-47.0565,0c-1.82639,0 -3.33048,-1.89777 -3.33048,-4.20223l0,-108.44445c0,-2.30444 1.50409,-4.20223 3.33048,-4.20223l47.0565,0z" />
        </g>
      </svg>
      {label}
    </div>
  );
};
