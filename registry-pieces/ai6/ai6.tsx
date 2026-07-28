"use client";

import { cn } from "@/lib/utils";

interface Ai6Props {
  value?: number;
  label?: string;
  lowLabel?: string;
  highLabel?: string;
  className?: string;
}

export const ai6Demo: Ai6Props = {
  value: 0.7,
  label: "Temperature",
  lowLabel: "Focused",
  highLabel: "Creative",
};

export function Ai6({
  value = 0,
  label = "Temperature",
  lowLabel = "Focused",
  highLabel = "Creative",
  className,
}: Ai6Props) {
  const pct = Math.max(0, Math.min(100, value * 100));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-2 rounded-md border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span className="font-mono text-sm font-semibold tabular-nums text-card-foreground">
            {value.toFixed(1)}
          </span>
        </div>
        <div
          className="relative flex h-5 items-center"
          aria-hidden="true"
        >
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500" />
          <span
            className="absolute size-4 -translate-x-1/2 rounded-full border-2 border-foreground bg-background shadow-sm"
            style={{ left: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>
    </div>
  );
}
