import { Seat } from "../seat";
import { Berth } from "../berth";

type LegendProps = {
  legends: {
    status: "booked" | "available" | "blocked" | "selected" | "female";
    type?: "seat" | "berth";
  }[];
};

export const Legend = ({ legends }: LegendProps) => {
  return (
    <div className="flex flex-col p-2 gap-2">
      {legends.map((legend) => {
        return legend.type === "seat" ? (
          <div className="flex items-center justify-between gap-2">
            <Seat {...legend} />
            <div>{legend.status.toUpperCase()}</div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <Berth {...legend} />
            <div>{legend.status.toUpperCase()}</div>
          </div>
        );
      })}
    </div>
  );
};
