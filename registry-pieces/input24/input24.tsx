"use client";

import { cn } from "@/lib/utils";

interface Input24Props {
  label?: string;
  min?: number;
  max?: number;
  low?: number;
  high?: number;
  unit?: string;
  className?: string;
}

export const input24Demo: Input24Props = {
  label: "Price range",
  min: 0,
  max: 500,
  low: 120,
  high: 320,
  unit: "€",
};

export function Input24({
  label,
  min = 0,
  max = 100,
  low = 0,
  high = 100,
  unit,
  className,
}: Input24Props) {
  const span = Math.max(1, max - min);
  const lowPct = Math.max(0, Math.min(100, ((low - min) / span) * 100));
  const highPct = Math.max(0, Math.min(100, ((high - min) / span) * 100));

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
          <span className="font-mono text-xs font-semibold text-card-foreground">
            {unit}
            {low} – {unit}
            {high}
          </span>
        </div>
        <div className="relative h-1.5 rounded-full bg-muted">
          <div
            className="absolute inset-y-0 rounded-full bg-primary"
            style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
            aria-hidden="true"
          />
          <span
            className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-primary bg-card shadow-sm"
            style={{ left: `calc(${lowPct}% - 0.5rem)` }}
            aria-hidden="true"
          />
          <span
            className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-primary bg-card shadow-sm"
            style={{ left: `calc(${highPct}% - 0.5rem)` }}
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
