import { useMemo, useCallback, memo } from "react";
import type { ChartProps, ParsedCell, SeatStatus, SeatType } from "../../types";
import { isParsedSeat } from "../../types";
import { parseSeatMap } from "../../utils/parse-seats";
import type { ParsedSeatMap } from "../../utils/parse-seats";
import { cn } from "../../utils/cn";
import { useSelection } from "../../hooks/useSelection";
import { SeatButton } from "../SeatButton";
import { LayoutCell } from "../LayoutCell";
import { Legend } from "../Legend";

interface ParsedLayer {
  name: string;
  seatMap: ParsedSeatMap;
}

/** Check if a cell is a berth */
function isBerthCell(cell: ParsedCell): boolean {
  return isParsedSeat(cell) && cell.type === "berth";
}

/**
 * Main seat chart component for displaying and selecting seats.
 * Supports single-layer and multi-layer (e.g., lower/upper deck) layouts.
 */
export const Chart = memo(function Chart({
  seatMaps,
  seatTypes,
  onSelectionChange,
  maxSelectableSeats,
  onMaxSeatsReached,
  bookedSeats,
  blockedSeats,
  legends,
  disabled = false,
  className,
}: ChartProps) {
  // Parse seat maps for all layers, continuing seat index across layers
  const parsedLayers = useMemo((): ParsedLayer[] => {
    // Check if seatMaps is an array (single layer) or object (multi-layer)
    if (Array.isArray(seatMaps)) {
      const result = parseSeatMap(seatMaps, seatTypes, bookedSeats, blockedSeats);
      return [{ name: "", seatMap: result.seatMap }];
    }
    // Multi-layer: object with named layers, continue numbering across layers
    const layers: ParsedLayer[] = [];
    let currentIndex = 0;
    for (const [name, seatMap] of Object.entries(seatMaps)) {
      const result = parseSeatMap(seatMap, seatTypes, bookedSeats, blockedSeats, currentIndex);
      layers.push({ name, seatMap: result.seatMap });
      currentIndex = result.nextIndex;
    }
    return layers;
  }, [seatMaps, seatTypes, bookedSeats, blockedSeats]);

  // Selection management
  const { isSelected, toggleSelection } = useSelection({
    onSelectionChange,
    maxSelectableSeats,
    onMaxSeatsReached,
  });

  const isMultiLayer = parsedLayers.length > 1;

  return (
    <div className={cn("w-fit", className)}>
      <div className={cn("flex gap-4", isMultiLayer ? "flex-row" : "flex-col")}>
        {parsedLayers.map((layer, layerIndex) => (
          <ChartLayer
            key={layer.name || layerIndex}
            layer={layer}
            layerIndex={layerIndex}
            isSelected={isSelected}
            onToggle={toggleSelection}
            disabled={disabled}
          />
        ))}
      </div>
      {legends && <Legend legends={legends} />}
    </div>
  );
});

interface ChartLayerProps {
  layer: ParsedLayer;
  layerIndex: number;
  isSelected: (label: string) => boolean;
  onToggle: (seat: {
    label: string;
    type: SeatType;
    price: number;
    status: SeatStatus;
  }) => void;
  disabled: boolean;
}

const ChartLayer = memo(function ChartLayer({
  layer,
  layerIndex,
  isSelected,
  onToggle,
  disabled,
}: ChartLayerProps) {
  // Calculate grid dimensions and check for berths
  const { numCols, hasBerths } = useMemo(() => {
    let maxCols = 0;
    let hasBerths = false;

    for (const row of layer.seatMap) {
      maxCols = Math.max(maxCols, row.length);
      if (!hasBerths && row.some(isBerthCell)) hasBerths = true;
    }

    return { numCols: maxCols, hasBerths };
  }, [layer.seatMap]);

  // If no berths, use simpler flex layout
  if (!hasBerths) {
    return (
      <div className="flex flex-col">
        {layer.name && (
          <div className="text-center text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {layer.name}
          </div>
        )}
        <div
          role="grid"
          aria-label={layer.name || "Seat chart"}
          className="flex flex-col p-2 rounded-lg border border-gray-500 gap-2"
        >
          {layer.seatMap.map((row, rowIndex) => (
            <div key={rowIndex} role="row" className="flex justify-center gap-2">
              {row.map((cell, colIndex) => (
                <ChartCell
                  key={`${layerIndex}-${rowIndex}-${colIndex}`}
                  cell={cell}
                  isSelected={isSelected}
                  onToggle={onToggle}
                  disabled={disabled}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // CSS Grid layout for berths - berths span 2 rows
  // Each seat map row corresponds to a grid row
  // Berths span from their row into the next (seat map should use _ for shadow cells)
  return (
    <div className="flex flex-col">
      {layer.name && (
        <div className="text-center text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {layer.name}
        </div>
      )}
      <div
        role="grid"
        aria-label={layer.name || "Seat chart"}
        className="grid p-2 rounded-lg border border-gray-500 gap-2 justify-center"
        style={{
          gridTemplateColumns: `repeat(${numCols}, auto)`,
        }}
      >
        {layer.seatMap.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <ChartCell
              key={`${layerIndex}-${rowIndex}-${colIndex}`}
              cell={cell}
              isSelected={isSelected}
              onToggle={onToggle}
              disabled={disabled}
              gridRow={rowIndex + 1}
              gridCol={colIndex + 1}
            />
          ))
        )}
      </div>
    </div>
  );
});

interface ChartCellProps {
  cell: ParsedCell;
  isSelected: (label: string) => boolean;
  onToggle: (seat: {
    label: string;
    type: SeatType;
    price: number;
    status: SeatStatus;
  }) => void;
  disabled: boolean;
  gridRow?: number;
  gridCol?: number;
}

const ChartCell = memo(function ChartCell({
  cell,
  isSelected,
  onToggle,
  disabled,
  gridRow,
  gridCol,
}: ChartCellProps) {
  const handleClick = useCallback(() => {
    if (isParsedSeat(cell)) {
      onToggle(cell);
    }
  }, [cell, onToggle]);

  const isBerth = isBerthCell(cell);
  const gridStyle = gridRow !== undefined && gridCol !== undefined
    ? {
        gridRow: isBerth ? `${gridRow} / span 2` : gridRow,
        gridColumn: gridCol,
      }
    : undefined;

  if (isParsedSeat(cell)) {
    return (
      <div role="row" style={gridStyle}>
        <SeatButton
          type={cell.type}
          label={cell.label}
          price={cell.price}
          status={cell.status}
          isSelected={isSelected(cell.label)}
          disabled={disabled}
          onClick={handleClick}
        />
      </div>
    );
  }

  return (
    <div role="row" style={gridStyle}>
      <LayoutCell type={cell.type} />
    </div>
  );
});
