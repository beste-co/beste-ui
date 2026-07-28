"use client";

import { cn } from "@/lib/utils";

interface Input4Props {
  value?: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  className?: string;
}

export const input4Demo: Input4Props = {
  value: 68,
  min: 0,
  max: 100,
  label: "Volume",
  unit: "%",
};

export function Input4({
  value = 0,
  min = 0,
  max = 100,
  label,
  unit = "",
  className,
}: Input4Props) {
  const range = max - min || 1;
  const pct = Math.max(0, Math.min(100, ((value - min) / range) * 100));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2">
        {(label || unit) && (
          <div className="flex items-center justify-between">
            {label && (
              <span className="text-sm font-medium text-card-foreground">
                {label}
              </span>
            )}
            <span className="text-sm font-semibold tabular-nums text-muted-foreground">
              {value}
              {unit}
            </span>
          </div>
        )}
        <div
          className="relative flex h-5 items-center"
          aria-hidden="true"
        >
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span
            className="absolute size-4 -translate-x-1/2 rounded-full border-2 border-primary bg-card shadow-sm"
            style={{ left: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
