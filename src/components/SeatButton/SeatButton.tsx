import { memo, useCallback, type KeyboardEvent } from "react";
import type { SeatButtonProps } from "../../types";
import { cn } from "../../utils/cn";
import { SeatIcon } from "../../icons/SeatIcon";
import { BerthIcon } from "../../icons/BerthIcon";

// Style constants
const BASE_STYLES =
  "relative select-none text-xs text-white rounded-xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400";

const SEAT_SIZE = "size-8";
// Berth spans 2 rows: 2rem (seat) + 0.5rem (gap) + 2rem (seat) = 4.5rem
const BERTH_SIZE = "w-8 h-[4.5rem]";

const STATUS_STYLES = {
  available: "bg-green-500 border-green-600 hover:bg-green-400 cursor-pointer",
  booked: "bg-gray-500 border-gray-600 cursor-not-allowed",
  blocked: "bg-amber-500 border-amber-600 cursor-not-allowed",
  selected: "bg-blue-500 border-blue-600 hover:bg-blue-400 cursor-pointer",
} as const;

/**
 * Unified seat button component for both seat and berth variants.
 * Includes full accessibility support with ARIA attributes and keyboard navigation.
 */
export const SeatButton = memo(function SeatButton({
  type,
  label,
  price,
  status,
  isSelected,
  disabled = false,
  onClick,
}: SeatButtonProps) {
  const isInteractive = status === "available";
  const effectiveStatus = isSelected ? "selected" : status;
  const isBerth = type === "berth";

  const handleClick = useCallback(() => {
    if (isInteractive && !disabled && onClick) {
      onClick();
    }
  }, [isInteractive, disabled, onClick]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && isInteractive && !disabled) {
        e.preventDefault();
        onClick?.();
      }
    },
    [isInteractive, disabled, onClick]
  );

  // Generate accessible label
  const ariaLabel = `${isBerth ? "Berth" : "Seat"} ${label}, ${effectiveStatus}${
    price > 0 ? `, $${price}` : ""
  }`;

  return (
    <button
      type="button"
      role="gridcell"
      aria-selected={isSelected}
      aria-disabled={!isInteractive || disabled}
      aria-label={ariaLabel}
      tabIndex={isInteractive && !disabled ? 0 : -1}
      className={cn(
        BASE_STYLES,
        isBerth ? BERTH_SIZE : SEAT_SIZE,
        STATUS_STYLES[effectiveStatus],
        disabled && "opacity-50"
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={!isInteractive || disabled}
    >
      {isBerth ? (
        <BerthIcon className="absolute" />
      ) : (
        <SeatIcon className="absolute" />
      )}
      {label}
    </button>
  );
});
