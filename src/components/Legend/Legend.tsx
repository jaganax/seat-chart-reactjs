import { memo } from "react";
import type { LegendProps, LegendItem, SeatStatus } from "../../types";
import { SeatButton } from "../SeatButton";

/**
 * Legend component showing seat status colors and their meanings.
 */
export const Legend = memo(function Legend({ legends }: LegendProps) {
  return (
    <div
      className="flex flex-col p-2 gap-2"
      role="list"
      aria-label="Seat status legend"
    >
      {legends.map((legend) => (
        <LegendRow key={`${legend.status}-${legend.type ?? "seat"}`} legend={legend} />
      ))}
    </div>
  );
});

interface LegendRowProps {
  legend: LegendItem;
}

const LegendRow = memo(function LegendRow({ legend }: LegendRowProps) {
  const type = legend.type ?? "seat";
  const isSelected = legend.status === "selected";
  // For "selected" status, we show an available seat with isSelected=true
  const status: SeatStatus = isSelected ? "available" : legend.status as SeatStatus;

  return (
    <div
      className="flex items-center justify-between gap-2"
      role="listitem"
    >
      <SeatButton
        type={type}
        label=""
        price={0}
        status={status}
        isSelected={isSelected}
        disabled
      />
      <div className="text-sm capitalize">{legend.status}</div>
    </div>
  );
});
