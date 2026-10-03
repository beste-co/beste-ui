"use client";

import { cn } from "@/lib/utils";

interface Input21Props {
  label?: string;
  hours?: number;
  minutes?: number;
  bordered?: boolean;
  className?: string;
}

export const input21Demo: Input21Props = {
  label: "Session length",
  hours: 1,
  minutes: 45,
  bordered: false,
};

export function Input21({
  label,
  hours = 0,
  minutes = 0,
  bordered = false,
  className,
}: Input21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className={cn("flex items-baseline justify-center gap-1 rounded-md bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
          <span className="text-lg font-bold tabular-nums text-card-foreground">
            {hours}
          </span>
          <span className="text-xs text-muted-foreground">h</span>
          <span className="text-lg font-bold tabular-nums text-card-foreground">
            {minutes.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground">m</span>
        </div>
      </div>
    </div>
  );
}
