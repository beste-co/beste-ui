"use client";

import { cn } from "@/lib/utils";

interface Input19Props {
  label?: string;
  min?: number;
  max?: number;
  value?: number;
  unit?: string;
  className?: string;
}

export const input19Demo: Input19Props = {
  label: "Monthly budget",
  min: 0,
  max: 1000,
  value: 420,
  unit: "$",
};

export function Input19({
  label,
  min = 0,
  max = 100,
  value = 0,
  unit,
  className,
}: Input19Props) {
  const pct = Math.max(
    0,
    Math.min(100, ((value - min) / Math.max(1, max - min)) * 100)
  );

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2">
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-xs font-medium text-card-foreground">
              {label}
            </label>
          )}
          <span className="font-mono text-sm font-semibold text-primary">
            {unit}
            {value}
          </span>
        </div>
        <div className="relative h-1.5 rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
          <span
            className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-primary bg-card shadow-sm"
            style={{ left: `calc(${pct}% - 0.5rem)` }}
            aria-hidden="true"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {unit}
            {min}
          </span>
          <span>
            {unit}
            {max}
          </span>
        </div>
      </div>
    </div>
  );
}
