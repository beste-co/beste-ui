"use client";

import { cn } from "@/lib/utils";

interface Chart3Props {
  label?: string;
  currentValue?: string;
  previousValue?: string;
  current?: number;
  previous?: number;
  currentLabel?: string;
  previousLabel?: string;
  className?: string;
}

export const chart3Demo: Chart3Props = {
  label: "Revenue",
  currentValue: "$48.2K",
  previousValue: "$42.9K",
  current: 48.2,
  previous: 42.9,
  currentLabel: "This week",
  previousLabel: "Last week",
};

export function Chart3({
  label,
  currentValue,
  previousValue,
  current = 0,
  previous = 0,
  currentLabel = "This week",
  previousLabel = "Last week",
  className,
}: Chart3Props) {
  const max = Math.max(current, previous, 1);
  const currentPct = (current / max) * 100;
  const previousPct = (previous / max) * 100;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-56 flex-col gap-2 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        {label && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-16 shrink-0 whitespace-nowrap text-xs text-muted-foreground">
              {currentLabel}
            </span>
            <div
              className="h-4 rounded-sm bg-primary transition-all"
              style={{ width: `${currentPct}%` }}
              aria-hidden="true"
            />
            <span className="shrink-0 text-sm font-semibold tabular-nums text-card-foreground">
              {currentValue}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 shrink-0 whitespace-nowrap text-xs text-muted-foreground">
              {previousLabel}
            </span>
            <div
              className="h-4 rounded-sm bg-muted transition-all"
              style={{ width: `${previousPct}%` }}
              aria-hidden="true"
            />
            <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
              {previousValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
