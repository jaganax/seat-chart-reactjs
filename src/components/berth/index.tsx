import { useState } from "react";

type BerthProps = {
  id: string;
  label: string;
  isbooked?: boolean;
  femaleOnly?: boolean;
  clickCallBack: (label: string) => void;
};

export const Berth = ({
  id,
  label,
  isbooked,
  femaleOnly,
  clickCallBack,
}: BerthProps) => {
  const [available, setAvailable] = useState(false);

  return isbooked ? (
    <div
      id={id}
      className="relative text-center text-xs border-2 text-white rounded-sm bg-no-repeat flex items-center justify-center bg-center w-8 h-16 bg-[url('/src/assets/berth.png')] bg-gray-500 border-gray-700 cursor-not-allowed [writing-mode:vertical-rl]"
      aria-disabled="true"
    >
      {label}
    </div>
  ) : (
    <div
      id={id}
      className={`relative text-center text-xs border-2 text-white rounded-sm bg-no-repeat flex items-center justify-center bg-center w-8 h-16 bg-[url('/src/assets/berth.png')] cursor-pointer ${
        available
          ? "bg-blue-500 border-blue-600 hover:bg-blue-400"
          : femaleOnly
          ? "bg-pink-500 border-pink-600 hover:bg-pink-400"
          : "bg-green-500 border-green-600 hover:bg-green-400"
      } [writing-mode:vertical-rl]`}
      onClick={() => {
        setAvailable((prev) => !prev);
        clickCallBack("label");
      }}
    >
      {label}
    </div>
  );
};
