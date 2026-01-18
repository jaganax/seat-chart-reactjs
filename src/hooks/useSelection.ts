import { useState, useCallback, useMemo } from "react";
import type { SelectedSeat, SeatStatus, SeatType } from "../types";

interface UseSelectionOptions {
  /** Callback when selection changes */
  onSelectionChange?: (seats: SelectedSeat[]) => void;
  /** Maximum number of seats that can be selected */
  maxSelectableSeats?: number;
  /** Callback when max selection limit is reached */
  onMaxSeatsReached?: (maxSeats: number) => void;
}

interface UseSelectionReturn {
  /** Check if a seat is selected */
  isSelected: (label: string) => boolean;
  /** Toggle selection of a seat */
  toggleSelection: (seat: {
    label: string;
    type: SeatType;
    price: number;
    status: SeatStatus;
  }) => void;
}

/**
 * Hook to manage seat selection state.
 */
export function useSelection({
  onSelectionChange,
  maxSelectableSeats,
  onMaxSeatsReached,
}: UseSelectionOptions): UseSelectionReturn {
  const [selection, setSelection] = useState<SelectedSeat[]>([]);

  // Set for O(1) lookup
  const selectedLabels = useMemo(
    () => new Set(selection.map((s) => s.label)),
    [selection]
  );

  const isSelected = useCallback(
    (label: string) => selectedLabels.has(label),
    [selectedLabels]
  );

  const toggleSelection = useCallback(
    (seat: {
      label: string;
      type: SeatType;
      price: number;
      status: SeatStatus;
    }): void => {
      const isCurrentlySelected = selectedLabels.has(seat.label);

      if (isCurrentlySelected) {
        // Deselect
        const newSelection = selection.filter((s) => s.label !== seat.label);
        setSelection(newSelection);
        onSelectionChange?.(newSelection);
      } else {
        // Check max limit before selecting
        if (maxSelectableSeats !== undefined && selection.length >= maxSelectableSeats) {
          onMaxSeatsReached?.(maxSelectableSeats);
          return;
        }
        // Select
        const newSelection = [
          ...selection,
          {
            label: seat.label,
            type: seat.type,
            price: seat.price,
            status: seat.status,
          },
        ];
        setSelection(newSelection);
        onSelectionChange?.(newSelection);
      }
    },
    [selection, selectedLabels, onSelectionChange, maxSelectableSeats, onMaxSeatsReached]
  );

  return {
    isSelected,
    toggleSelection,
  };
}
