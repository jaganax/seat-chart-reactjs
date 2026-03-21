import { useCallback, useRef, type KeyboardEvent, type RefObject } from "react";

interface UseGridNavigationReturn {
  gridRef: RefObject<HTMLDivElement | null>;
  handleGridKeyDown: (e: KeyboardEvent) => void;
}

/**
 * Returns the focusable element inside a gridcell.
 * For seat gridcells, this is the button inside the gridcell div.
 * For layout gridcells (driver/door/space), the gridcell div itself is focusable.
 */
function getFocusableElement(gridcell: HTMLElement): HTMLElement {
  const button = gridcell.querySelector<HTMLElement>("button");
  return button ?? gridcell;
}

/**
 * Hook for WAI-ARIA grid arrow key navigation with roving tabindex.
 * Manages focus movement between all gridcells using arrow keys.
 * Only one cell has tabIndex={0} at a time (roving tabindex pattern).
 */
export function useGridNavigation(): UseGridNavigationReturn {
  const gridRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);

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

    // Find all gridcells (both interactive and non-interactive)
    const gridcells = Array.from(
      grid.querySelectorAll<HTMLElement>('[role="gridcell"]')
    );

    // Find current gridcell (active element may be the button inside a gridcell)
    const currentGridcell = active.getAttribute("role") === "gridcell"
      ? active
      : active.closest<HTMLElement>('[role="gridcell"]');

    const currentIndex = currentGridcell ? gridcells.indexOf(currentGridcell) : -1;
    if (currentIndex === -1) return;

    // For up/down: find cells by spatial position
    let nextIndex: number | undefined;

    if (e.key === "ArrowRight") {
      nextIndex = currentIndex + 1 < gridcells.length ? currentIndex + 1 : undefined;
    } else if (e.key === "ArrowLeft") {
      nextIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : undefined;
    } else {
      // ArrowUp / ArrowDown — find the nearest cell above/below
      const currentFocusable = getFocusableElement(gridcells[currentIndex]);
      const currentRect = currentFocusable.getBoundingClientRect();
      const centerX = currentRect.left + currentRect.width / 2;
      const direction = e.key === "ArrowDown" ? 1 : -1;

      let bestIndex: number | undefined;
      let bestDistance = Infinity;

      for (let i = 0; i < gridcells.length; i++) {
        if (i === currentIndex) continue;
        const focusable = getFocusableElement(gridcells[i]);
        const rect = focusable.getBoundingClientRect();
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

      // Roving tabindex: remove tabIndex from old, set on new
      const oldFocusable = getFocusableElement(gridcells[currentIndex]);
      const newFocusable = getFocusableElement(gridcells[nextIndex]);

      oldFocusable.setAttribute("tabindex", "-1");
      newFocusable.setAttribute("tabindex", "0");
      newFocusable.focus();

      activeIndexRef.current = nextIndex;
    }
  }, []);

  return { gridRef, handleGridKeyDown };
}
