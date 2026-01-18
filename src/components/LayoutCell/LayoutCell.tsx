import { memo } from "react";
import type { LayoutType } from "../../types";
import { DriverIcon } from "../../icons/DriverIcon";
import { DoorIcon } from "../../icons/DoorIcon";

interface LayoutCellProps {
  type: LayoutType;
}

/**
 * Non-interactive layout cell for driver, door, and empty space positions.
 */
export const LayoutCell = memo(function LayoutCell({ type }: LayoutCellProps) {
  switch (type) {
    case "driver":
      return (
        <div
          className="size-8"
          role="gridcell"
          aria-label="Driver position"
        >
          <DriverIcon className="text-black dark:text-white" />
        </div>
      );

    case "door":
      return (
        <div
          className="size-8"
          role="gridcell"
          aria-label="Door"
        >
          <DoorIcon className="text-black dark:text-white" />
        </div>
      );

    case "space":
    default:
      return (
        <div
          className="size-8"
          role="gridcell"
          aria-hidden="true"
        />
      );
  }
});
