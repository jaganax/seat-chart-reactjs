import { useReducer, useCallback, useMemo, useRef } from "react";
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
  /** Set of selected seat labels for O(1) lookup */
  selectedLabels: Set<string>;
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

type SelectionAction =
  | { type: "SELECT"; seat: SelectedSeat }
  | { type: "DESELECT"; label: string };

function selectionReducer(
  state: SelectedSeat[],
  action: SelectionAction
): SelectedSeat[] {
  switch (action.type) {
    case "SELECT":
      return [...state, action.seat];
    case "DESELECT":
      return state.filter((s) => s.label !== action.label);
  }
}

/**
 * Hook to manage seat selection state.
 * Uses useReducer + useRef for stable callback references,
 * preventing cascade re-renders across all seat cells.
 */
export function useSelection({
  onSelectionChange,
  maxSelectableSeats,
  onMaxSeatsReached,
}: UseSelectionOptions): UseSelectionReturn {
  const [selection, dispatch] = useReducer(selectionReducer, []);

  // Refs for callbacks and config — avoids dependency churn on toggleSelection
  const callbacksRef = useRef({ onSelectionChange, maxSelectableSeats, onMaxSeatsReached });
  callbacksRef.current = { onSelectionChange, maxSelectableSeats, onMaxSeatsReached };

  // Refs for current state — read inside stable toggleSelection
  const selectionRef = useRef(selection);
  selectionRef.current = selection;

  // Set for O(1) lookup — recomputed only when selection changes
  const selectedLabels = useMemo(
    () => new Set(selection.map((s) => s.label)),
    [selection]
  );
  const selectedLabelsRef = useRef(selectedLabels);
  selectedLabelsRef.current = selectedLabels;

  // Stable — reads refs, never recreated
  const isSelected = useCallback(
    (label: string) => selectedLabelsRef.current.has(label),
    []
  );

  // Stable — empty dependency array, reads current state via refs
  const toggleSelection = useCallback(
    (seat: {
      label: string;
      type: SeatType;
      price: number;
      status: SeatStatus;
    }): void => {
      const { onSelectionChange, maxSelectableSeats, onMaxSeatsReached } =
        callbacksRef.current;
      const current = selectionRef.current;
      const isCurrentlySelected = selectedLabelsRef.current.has(seat.label);

      if (isCurrentlySelected) {
        const newSelection = current.filter((s) => s.label !== seat.label);
        dispatch({ type: "DESELECT", label: seat.label });
        onSelectionChange?.(newSelection);
      } else {
        if (
          maxSelectableSeats !== undefined &&
          current.length >= maxSelectableSeats
        ) {
          onMaxSeatsReached?.(maxSelectableSeats);
          return;
        }
        const newSeat: SelectedSeat = {
          label: seat.label,
          type: seat.type,
          price: seat.price,
          status: seat.status,
        };
        const newSelection = [...current, newSeat];
        dispatch({ type: "SELECT", seat: newSeat });
        onSelectionChange?.(newSelection);
      }
    },
    []
  );

  return {
    selectedLabels,
    isSelected,
    toggleSelection,
  };
}
