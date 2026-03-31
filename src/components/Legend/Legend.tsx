import { memo } from 'react';
import type { LegendProps, LegendItem, SeatStatus } from '../../types';
import { SeatButton } from '../SeatButton';

/**
 * Legend component showing seat status colors and their meanings.
 * Renders in a 2-column grid with compact seat swatches.
 */
export const Legend = memo(function Legend({ legends }: LegendProps) {
  return (
    <div
      className="grid grid-cols-2 p-2 gap-x-4 gap-y-1.5"
      role="list"
      aria-label="Seat status legend"
    >
      {legends.map((legend) => (
        <LegendRow key={`${legend.status}-${legend.type ?? 'seat'}`} legend={legend} />
      ))}
    </div>
  );
});

interface LegendRowProps {
  legend: LegendItem;
}

const LegendRow = memo(function LegendRow({ legend }: LegendRowProps) {
  const type = legend.type ?? 'seat';
  const isSelected = legend.status === 'selected';
  // For "selected" status, we show an available seat with isSelected=true
  const status: SeatStatus = isSelected ? 'available' : (legend.status as SeatStatus);

  return (
    <div className="flex items-center gap-1.5" role="listitem">
      <div className="scale-75 origin-left">
        <SeatButton
          type={type}
          label=""
          price={0}
          status={status}
          isSelected={isSelected}
          disabled
          decorative
        />
      </div>
      <div className="text-xs capitalize text-gray-700 dark:text-gray-300">{legend.status}</div>
    </div>
  );
});
