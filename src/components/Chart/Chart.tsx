import { useMemo, useCallback, useState, useRef, useEffect, memo } from 'react';
import type { ChartProps, ParsedCell, SeatStatus, SeatType } from '../../types';
import { isParsedSeat } from '../../types';
import { parseSeatMap } from '../../utils/parse-seats';
import type { ParsedSeatMap } from '../../utils/parse-seats';
import { cn } from '../../utils/cn';
import { useSelection } from '../../hooks/useSelection';
import { useGridNavigation } from '../../hooks/useGridNavigation';
import { SeatButton } from '../SeatButton';
import { LayoutCell } from '../LayoutCell';
import { Legend } from '../Legend';

interface ParsedLayer {
  name: string;
  seatMap: ParsedSeatMap;
}

/** Check if a cell is a berth */
function isBerthCell(cell: ParsedCell): boolean {
  return isParsedSeat(cell) && cell.type === 'berth';
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
  priceFormatter,
}: ChartProps) {
  // Serialize dependencies to stabilize memoization against inline objects/arrays
  const seatMapsKey = JSON.stringify(seatMaps);
  const seatTypesKey = JSON.stringify(seatTypes);
  const bookedKey = bookedSeats?.join(',') ?? '';
  const blockedKey = blockedSeats?.join(',') ?? '';

  // Parse seat maps for all layers, continuing seat index across layers
  const parsedLayers = useMemo((): ParsedLayer[] => {
    // Check if seatMaps is an array (single layer) or object (multi-layer)
    if (Array.isArray(seatMaps)) {
      const result = parseSeatMap(seatMaps, seatTypes, bookedSeats, blockedSeats);
      return [{ name: '', seatMap: result.seatMap }];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seatMapsKey, seatTypesKey, bookedKey, blockedKey]);

  // Selection management
  const { selectedLabels, toggleSelection } = useSelection({
    onSelectionChange,
    maxSelectableSeats,
    onMaxSeatsReached: (max) => {
      setMaxReachedMessage(`Maximum of ${max} seats reached. Deselect a seat first.`);
      onMaxSeatsReached?.(max);
    },
  });

  // Live region state for screen reader announcements
  const [maxReachedMessage, setMaxReachedMessage] = useState('');
  const clearTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Clear max reached message after announcement
  useEffect(() => {
    if (maxReachedMessage) {
      clearTimerRef.current = setTimeout(() => setMaxReachedMessage(''), 1000);
      return () => clearTimeout(clearTimerRef.current);
    }
  }, [maxReachedMessage]);

  const isMultiLayer = parsedLayers.length > 1;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={cn('w-fit', className)}>
      {isMultiLayer ? (
        <div className="flex flex-col">
          {/* Tab list */}
          <div role="tablist" aria-label="Seat chart layers" className="flex">
            {parsedLayers.map((layer, index) => (
              <button
                key={layer.name || index}
                type="button"
                role="tab"
                id={`seat-chart-tab-${index}`}
                aria-selected={activeTab === index}
                aria-controls={`seat-chart-tabpanel-${index}`}
                tabIndex={activeTab === index ? 0 : -1}
                className={cn(
                  'flex-1 px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 -mb-px transition-colors motion-reduce:transition-none',
                  activeTab === index
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 z-10'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer',
                )}
                onClick={() => setActiveTab(index)}
                onKeyDown={(e) => {
                  let nextIndex: number | undefined;
                  if (e.key === 'ArrowRight') {
                    nextIndex = (index + 1) % parsedLayers.length;
                  } else if (e.key === 'ArrowLeft') {
                    nextIndex = (index - 1 + parsedLayers.length) % parsedLayers.length;
                  } else if (e.key === 'Home') {
                    nextIndex = 0;
                  } else if (e.key === 'End') {
                    nextIndex = parsedLayers.length - 1;
                  }
                  if (nextIndex !== undefined) {
                    e.preventDefault();
                    setActiveTab(nextIndex);
                    document.getElementById(`seat-chart-tab-${nextIndex}`)?.focus();
                  }
                }}
              >
                {layer.name}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          {parsedLayers.map((layer, layerIndex) => (
            <div
              key={layer.name || layerIndex}
              role="tabpanel"
              id={`seat-chart-tabpanel-${layerIndex}`}
              aria-labelledby={`seat-chart-tab-${layerIndex}`}
              hidden={activeTab !== layerIndex}
            >
              {activeTab === layerIndex && (
                <ChartLayer
                  layer={layer}
                  layerIndex={layerIndex}
                  selectedLabels={selectedLabels}
                  onToggle={toggleSelection}
                  disabled={disabled}
                  priceFormatter={priceFormatter}
                  hideHeading
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        parsedLayers.map((layer, layerIndex) => (
          <ChartLayer
            key={layer.name || layerIndex}
            layer={layer}
            layerIndex={layerIndex}
            selectedLabels={selectedLabels}
            onToggle={toggleSelection}
            disabled={disabled}
            priceFormatter={priceFormatter}
          />
        ))
      )}
      {legends && <Legend legends={legends} />}

      {/* Live region: selection count */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {selectedLabels.size > 0
          ? `${selectedLabels.size} seat${selectedLabels.size !== 1 ? 's' : ''} selected`
          : ''}
      </div>

      {/* Live region: max seats reached */}
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {maxReachedMessage}
      </div>
    </div>
  );
});

interface ChartLayerProps {
  layer: ParsedLayer;
  layerIndex: number;
  selectedLabels: Set<string>;
  onToggle: (seat: { label: string; type: SeatType; price: number; status: SeatStatus }) => void;
  disabled: boolean;
  priceFormatter?: (price: number) => string;
  /** When true, the layer name heading is suppressed (tabbed layout provides the label) */
  hideHeading?: boolean;
}

const ChartLayer = memo(function ChartLayer({
  layer,
  layerIndex,
  selectedLabels,
  onToggle,
  disabled,
  priceFormatter,
  hideHeading = false,
}: ChartLayerProps) {
  const { gridRef, handleGridKeyDown } = useGridNavigation();

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

  const showHeading = !hideHeading && !!layer.name;
  const headingId = showHeading ? `seat-chart-layer-${layerIndex}` : undefined;
  const instructionsId = `seat-chart-instructions-${layerIndex}`;

  // If no berths, use simpler flex layout
  if (!hasBerths) {
    return (
      <div className="flex flex-col">
        {showHeading && (
          <h3
            id={headingId}
            className="text-center text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
          >
            {layer.name}
          </h3>
        )}
        <p id={instructionsId} className="sr-only">
          Use arrow keys to navigate between seats. Press Enter or Space to select or deselect a
          seat.
        </p>
        <div
          ref={gridRef}
          role="grid"
          tabIndex={-1}
          aria-labelledby={headingId}
          aria-label={headingId ? undefined : 'Seat chart'}
          aria-describedby={instructionsId}
          className={cn(
            'flex flex-col p-2 border border-gray-300 dark:border-gray-600 gap-2',
            hideHeading ? 'rounded-b-lg' : 'rounded-lg',
          )}
          onKeyDown={handleGridKeyDown}
        >
          {layer.seatMap.map((row, rowIndex) => (
            <div key={rowIndex} role="row" className="flex justify-center gap-2">
              {row.map((cell, colIndex) => (
                <ChartCell
                  key={`${layerIndex}-${rowIndex}-${colIndex}`}
                  cell={cell}
                  selected={isParsedSeat(cell) && selectedLabels.has(cell.label)}
                  onToggle={onToggle}
                  disabled={disabled}
                  priceFormatter={priceFormatter}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // CSS Grid layout for berths - berths span 2 rows
  return (
    <div className="flex flex-col">
      {showHeading && (
        <h3
          id={headingId}
          className="text-center text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
        >
          {layer.name}
        </h3>
      )}
      <p id={instructionsId} className="sr-only">
        Use arrow keys to navigate between seats. Press Enter or Space to select or deselect a seat.
      </p>
      <div
        ref={gridRef}
        role="grid"
        tabIndex={-1}
        aria-labelledby={headingId}
        aria-label={headingId ? undefined : 'Seat chart'}
        aria-describedby={instructionsId}
        className={cn(
          'grid p-2 border border-gray-300 dark:border-gray-600 gap-2 justify-center',
          hideHeading ? 'rounded-b-lg' : 'rounded-lg',
        )}
        onKeyDown={handleGridKeyDown}
        style={{
          gridTemplateColumns: `repeat(${numCols}, auto)`,
        }}
      >
        {layer.seatMap.map((row, rowIndex) => (
          <div key={rowIndex} role="row" style={{ display: 'contents' }}>
            {row.map((cell, colIndex) => (
              <ChartCell
                key={`${layerIndex}-${rowIndex}-${colIndex}`}
                cell={cell}
                selected={isParsedSeat(cell) && selectedLabels.has(cell.label)}
                onToggle={onToggle}
                disabled={disabled}
                gridRow={rowIndex + 1}
                gridCol={colIndex + 1}
                priceFormatter={priceFormatter}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

interface ChartCellProps {
  cell: ParsedCell;
  selected: boolean;
  onToggle: (seat: { label: string; type: SeatType; price: number; status: SeatStatus }) => void;
  disabled: boolean;
  gridRow?: number;
  gridCol?: number;
  priceFormatter?: (price: number) => string;
}

const ChartCell = memo(function ChartCell({
  cell,
  selected,
  onToggle,
  disabled,
  gridRow,
  gridCol,
  priceFormatter,
}: ChartCellProps) {
  const handleClick = useCallback(() => {
    if (isParsedSeat(cell)) {
      onToggle(cell);
    }
  }, [cell, onToggle]);

  const isBerth = isBerthCell(cell);
  const gridStyle =
    gridRow !== undefined && gridCol !== undefined
      ? {
          gridRow: isBerth ? `${gridRow} / span 2` : gridRow,
          gridColumn: gridCol,
        }
      : undefined;

  if (isParsedSeat(cell)) {
    return (
      <div style={gridStyle}>
        <SeatButton
          type={cell.type}
          label={cell.label}
          price={cell.price}
          status={cell.status}
          isSelected={selected}
          disabled={disabled}
          onClick={handleClick}
          priceFormatter={priceFormatter}
        />
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      <LayoutCell type={cell.type} />
    </div>
  );
});
