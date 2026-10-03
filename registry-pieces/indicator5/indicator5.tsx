"use client";

import { cn } from "@/lib/utils";

interface Indicator5Props {
  bars?: number;
  total?: number;
  label?: string;
  bordered?: boolean;
  className?: string;
}

export const indicator5Demo: Indicator5Props = {
  bars: 3,
  total: 4,
  label: "5G",
  bordered: false,
};

export function Indicator5({
  bars = 0,
  total = 4,
  label,
  bordered = false,
  className,
}: Indicator5Props) {
  const clampedTotal = Math.max(1, total);
  const clampedBars = Math.max(0, Math.min(bars, clampedTotal));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-2 rounded-lg bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
        <div
          className="flex items-end gap-0.5"
          aria-hidden="true"
        >
          {Array.from({ length: clampedTotal }).map((_, i) => {
            const filled = i < clampedBars;
            return (
              <span
                key={i}
                className={cn(
                  "w-1 rounded-sm transition-colors",
                  filled ? "bg-card-foreground" : "bg-border"
                )}
                style={{ height: `${(i + 1) * 4 + 2}px` }}
              />
            );
          })}
        </div>
        {label && (
          <span className="text-xs font-semibold text-card-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
