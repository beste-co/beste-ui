"use client";

import { cn } from "@/lib/utils";

interface Money18Props {
  label?: string;
  score?: number;
  min?: number;
  max?: number;
  status?: string;
  className?: string;
}

export const money18Demo: Money18Props = {
  label: "Credit score",
  score: 742,
  min: 300,
  max: 850,
  status: "Good",
};

export function Money18({
  label,
  score = 0,
  min = 300,
  max = 850,
  status,
  className,
}: Money18Props) {
  const clamped = Math.max(min, Math.min(max, score));
  const position = ((clamped - min) / (max - min || 1)) * 100;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3.5 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          {label && (
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {label}
            </span>
          )}
          {status && (
            <span className="text-sm font-medium text-muted-foreground">
              {status}
            </span>
          )}
        </div>
        <span className="text-4xl font-bold tabular-nums text-foreground">
          {score}
        </span>
        <div className="flex flex-col gap-1">
          <div className="relative h-1.5 rounded-full bg-muted">
            <div
              className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-foreground"
              style={{ left: `${position}%` }}
              aria-hidden="true"
            />
          </div>
          <div className="flex justify-between text-xs tabular-nums text-muted-foreground">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
