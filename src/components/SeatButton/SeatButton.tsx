import { memo, useCallback, type KeyboardEvent } from 'react';
import type { SeatButtonProps } from '../../types';
import { cn } from '../../utils/cn';

// Style constants
const BASE_STYLES =
  'relative select-none text-[10px] font-semibold rounded-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 dark:focus:ring-offset-gray-900 transition-transform active:scale-95 motion-reduce:transition-none border';

const SEAT_SIZE = 'size-10';
// Berth spans 2 rows: 2.5rem (seat) + 0.5rem (gap) + 2.5rem (seat) = 5.5rem
const BERTH_SIZE = 'w-10 h-[5.5rem]';

// Color palette: green=available, gray=booked, red=blocked, blue=selected
const STATUS_STYLES = {
  available:
    'bg-green-500 border-green-600 text-white hover:bg-green-400 hover:border-green-500 dark:bg-green-600 dark:border-green-700 dark:hover:bg-green-500 dark:hover:border-green-600 cursor-pointer',
  booked:
    'bg-gray-400 border-gray-400 text-white dark:bg-gray-600 dark:border-gray-600 cursor-not-allowed',
  blocked:
    'bg-red-500 border-red-600 text-white dark:bg-red-600 dark:border-red-700 cursor-not-allowed',
  selected:
    'bg-blue-500 border-blue-600 text-white hover:bg-blue-400 hover:border-blue-500 dark:bg-blue-600 dark:border-blue-700 dark:hover:bg-blue-500 dark:hover:border-blue-600 cursor-pointer',
} as const;

// Icon color per status — seat/berth shape overlay
const ICON_STYLES = {
  available: 'text-white/50',
  booked: 'text-white/50',
  blocked: 'text-white/50',
  selected: 'text-white/50',
} as const;

/**
 * Unified seat button component for both seat and berth variants.
 * Renders a gridcell wrapper with a button inside for proper WAI-ARIA grid structure.
 * When `decorative` is true, renders without grid ARIA roles (for Legend usage).
 */
export const SeatButton = memo(function SeatButton({
  type,
  label,
  price,
  status,
  isSelected,
  disabled = false,
  onClick,
  decorative = false,
  priceFormatter,
}: SeatButtonProps & { priceFormatter?: (price: number) => string }) {
  const isInteractive = status === 'available';
  const effectiveStatus = isSelected ? 'selected' : status;
  const isBerth = type === 'berth';

  const handleClick = useCallback(() => {
    if (isInteractive && !disabled && onClick) {
      onClick();
    }
  }, [isInteractive, disabled, onClick]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && isInteractive && !disabled) {
        e.preventDefault();
        onClick?.();
      }
    },
    [isInteractive, disabled, onClick],
  );

  // Generate accessible label
  const priceText = price > 0 ? `, ${priceFormatter ? priceFormatter(price) : `$${price}`}` : '';
  const ariaLabel = `${isBerth ? 'Berth' : 'Seat'} ${label}, ${effectiveStatus}${priceText}`;

  const iconCls = cn(
    'absolute inset-0 w-full h-full',
    isBerth ? 'p-0.5' : 'p-1',
    ICON_STYLES[effectiveStatus],
  );

  const button = (
    <button
      type="button"
      aria-disabled={!isInteractive || disabled}
      aria-label={ariaLabel}
      tabIndex={isInteractive && !disabled ? 0 : -1}
      className={cn(
        BASE_STYLES,
        isBerth ? BERTH_SIZE : SEAT_SIZE,
        STATUS_STYLES[effectiveStatus],
        disabled && 'opacity-50',
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={!isInteractive || disabled}
    >
      {/* Seat/berth shape as background watermark */}
      {isBerth ? (
        <svg
          viewBox="0 0 64 128"
          xmlns="http://www.w3.org/2000/svg"
          className={iconCls}
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="m10.85,15.1l0,3.1c0,3.5 2.8,6.3 6.3,6.3l29.7,0c3.5,0 6.3,-2.8 6.3,-6.3l0,-3.1c0,-3.5 -2.8,-6.3 -6.3,-6.3l-29.7,0c-3.4,0 -6.3,2.8 -6.3,6.3zm36.1,-4.4c2.4,0 4.4,2 4.4,4.4l0,3.1c0,2.4 -2,4.4 -4.4,4.4l-29.8,0c-2.4,0 -4.4,-2 -4.4,-4.4l0,-3.1c0,-2.4 2,-4.4 4.4,-4.4l29.8,0z"
          />
          <path
            fill="currentColor"
            d="m3.1,9.77777l0,108.44445c0,3.79556 2.36357,6.77777 5.37175,6.77777l47.0565,0c3.00818,0 5.37175,-2.98223 5.37175,-6.77777l0,-108.44445c0,-3.79556 -2.36357,-6.77777 -5.37175,-6.77777l-47.0565,0c-2.90074,0 -5.37175,2.98223 -5.37175,6.77777zm52.42825,-4.20223c1.82639,0 3.33048,1.89777 3.33048,4.20223l0,108.44445c0,2.30444 -1.50409,4.20223 -3.33048,4.20223l-47.0565,0c-1.82639,0 -3.33048,-1.89777 -3.33048,-4.20223l0,-108.44445c0,-2.30444 1.50409,-4.20223 3.33048,-4.20223l47.0565,0z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className={iconCls}
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            transform="rotate(90 50 50)"
            d="m87.7,11.59949c-0.8,-3.78381 -4.1,-6.74949 -8.2,-6.74949l-42.6,0c-4,0 -7.4,2.86342 -8.2,6.64723l-17,0c-3.7,0.10227 -6.7,3.06795 -6.7,6.85176l0,63.09751c0,3.78381 3,6.74949 6.7,6.74949l16.9,0c0.7,3.98834 4.1,6.95402 8.2,6.95402l42.7,0c3.8,0 7,-2.55663 8,-5.93137c4.2,-0.40906 7.5,-3.98834 7.5,-8.38573l0,-60.94994c0,-4.19287 -3.2,-7.77214 -7.3,-8.28347l0,-0.00001zm-50.8,-3.78381l42.7,0c2.5,0 4.5,1.63624 5.2,3.88607c-3.3,0.81812 -5.8,3.57928 -6.3,6.95402l-41.6,0c-3,0 -5.4,-2.45436 -5.4,-5.42005s2.4,-5.42005 5.4,-5.42005l0,0.00001zm-8.2,77.41461l-17,0c-2.1,0 -3.8,-1.73851 -3.8,-3.78381l0,-63.09751c0,-2.14757 1.7,-3.78381 3.8,-3.78381l16.9,0c0.6,4.0906 4.1,7.15855 8.2,7.15855l41.4,0l0,56.75708l-41.3,0c-4.1,-0.10227 -7.5,2.86342 -8.2,6.74949l0,0.00001zm50.8,7.05629l-42.6,0c-3,0 -5.4,-2.45436 -5.4,-5.42005s2.4,-5.42005 5.4,-5.42005l41.5,0c0.2,3.68154 2.8,6.64723 6.2,7.56761c-0.9,1.84077 -2.8,3.27248 -5.1,3.27248l0,0.00001zm12.6,-11.45368c0,2.96569 -2.4,5.42005 -5.4,5.42005s-5.4,-2.45436 -5.4,-5.42005l0,-60.94994c0,-2.96569 2.4,-5.42005 5.4,-5.42005s5.4,2.45436 5.4,5.42005l0,60.94994z"
          />
        </svg>
      )}

      {/* Label text */}
      <span className="relative z-10">{label}</span>

      {/* Status indicator icon (non-available states only) */}
      {effectiveStatus === 'selected' && (
        <svg
          viewBox="0 0 16 16"
          className="absolute top-0.5 right-0.5 size-3 text-white"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
          />
        </svg>
      )}
      {effectiveStatus === 'booked' && (
        <svg
          viewBox="0 0 16 16"
          className="absolute top-0.5 right-0.5 size-3 text-white/80"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 13c0-2.21 2.69-4 6-4s6 1.79 6 4v1H2v-1Z"
          />
        </svg>
      )}
      {effectiveStatus === 'blocked' && (
        <svg
          viewBox="0 0 16 16"
          className="absolute top-0.5 right-0.5 size-3 text-white/80"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M8 1a4 4 0 0 0-4 4v2H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V5a4 4 0 0 0-4-4Zm2 6H6V5a2 2 0 1 1 4 0v2Z"
          />
        </svg>
      )}
    </button>
  );

  if (decorative) {
    return <div aria-hidden="true">{button}</div>;
  }

  return (
    <div role="gridcell" aria-selected={isSelected}>
      {button}
    </div>
  );
});
