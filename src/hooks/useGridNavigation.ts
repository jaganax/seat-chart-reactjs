import { useCallback, useRef, type KeyboardEvent, type RefObject } from "react";

interface UseGridNavigationReturn {
  gridRef: RefObject<HTMLDivElement | null>;
  handleGridKeyDown: (e: KeyboardEvent) => void;
}

/**
 * Hook for WAI-ARIA grid arrow key navigation.
 * Manages focus movement between interactive gridcells using arrow keys.
 */
export function useGridNavigation(): UseGridNavigationReturn {
  const gridRef = useRef<HTMLDivElement>(null);

  const handleGridKeyDown = useCallback((e: KeyboardEvent) => {
    const grid = gridRef.current;
    if (!grid) return;

    const isArrowKey =
      e.key === "ArrowRight" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowUp";

    if (!isArrowKey) return;

    const active = document.activeElement as HTMLElement | null;
    if (!active || !grid.contains(active)) return;

    // Find all interactive gridcells (available seats)
    const focusable = Array.from(
      grid.querySelectorAll<HTMLElement>(
        'button[role="gridcell"]:not([disabled])'
      )
    );

    const currentIndex = focusable.indexOf(active);
    if (currentIndex === -1) return;

    // For up/down: find cells by spatial position
    let nextIndex: number | undefined;

    if (e.key === "ArrowRight") {
      nextIndex = currentIndex + 1 < focusable.length ? currentIndex + 1 : undefined;
    } else if (e.key === "ArrowLeft") {
      nextIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : undefined;
    } else {
      // ArrowUp / ArrowDown — find the nearest cell above/below
      const currentRect = active.getBoundingClientRect();
      const centerX = currentRect.left + currentRect.width / 2;
      const direction = e.key === "ArrowDown" ? 1 : -1;

      let bestIndex: number | undefined;
      let bestDistance = Infinity;

      for (let i = 0; i < focusable.length; i++) {
        if (i === currentIndex) continue;
        const rect = focusable[i].getBoundingClientRect();
        const cellCenterY = rect.top + rect.height / 2;
        const currentCenterY = currentRect.top + currentRect.height / 2;
        const verticalDiff = (cellCenterY - currentCenterY) * direction;

        // Must be in the correct direction
        if (verticalDiff <= 0) continue;

        const horizontalDiff = Math.abs(
          rect.left + rect.width / 2 - centerX
        );
        const distance = verticalDiff + horizontalDiff;

        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = i;
        }
      }

      nextIndex = bestIndex;
    }

    if (nextIndex !== undefined) {
      e.preventDefault();
      focusable[nextIndex].focus();
    }
  }, []);

  return { gridRef, handleGridKeyDown };
}
