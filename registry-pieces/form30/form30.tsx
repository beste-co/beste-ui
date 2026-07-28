"use client";

import { cn } from "@/lib/utils";

interface Form30Props {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  marks?: number[];
  className?: string;
}

export const form30Demo: Form30Props = {
  label: "Font size",
  min: 12,
  max: 24,
  step: 1,
  value: 16,
  marks: [12, 14, 16, 18, 20, 22, 24],
};

export function Form30({
  label,
  min = 0,
  max = 100,
  value = 0,
  marks = [],
  className,
}: Form30Props) {
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
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-card-foreground">
            {value}
          </span>
        </div>
        <div className="relative pt-3">
          <div className="h-1.5 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${pct}%` }}
              aria-hidden="true"
            />
          </div>
          {marks.map((m, idx) => {
            const mPct = ((m - min) / Math.max(1, max - min)) * 100;
            return (
              <span
                key={idx}
                className={cn(
                  "absolute size-1 -translate-x-1/2 rounded-full",
                  m <= value ? "bg-primary" : "bg-muted-foreground/30"
                )}
                style={{ left: `${mPct}%`, top: "calc(0.75rem + 3px)" }}
                aria-hidden="true"
              />
            );
          })}
          <span
            className="absolute top-3 size-4 -translate-y-1/2 rounded-full border-2 border-primary bg-card shadow-sm"
            style={{ left: `calc(${pct}% - 0.5rem)`, top: "calc(0.75rem + 0.125rem)" }}
            aria-hidden="true"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}
