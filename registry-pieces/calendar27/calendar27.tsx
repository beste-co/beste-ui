"use client";

import { cn } from "@/lib/utils";

interface Calendar27Props {
  label?: string;
  days?: { label: string; count: number }[];
  max?: number;
  className?: string;
}

export const calendar27Demo: Calendar27Props = {
  label: "This week · meetings",
  days: [
    { label: "Mon", count: 3 },
    { label: "Tue", count: 5 },
    { label: "Wed", count: 4 },
    { label: "Thu", count: 7 },
    { label: "Fri", count: 4 },
  ],
  max: 8,
};

export function Calendar27({
  label,
  days = [],
  max,
  className,
}: Calendar27Props) {
  const resolvedMax = Math.max(
    1,
    max ?? days.reduce((m, d) => Math.max(m, d.count), 0)
  );
  const peakIdx = days.reduce(
    (best, d, idx) => (d.count > (days[best]?.count ?? 0) ? idx : best),
    0
  );

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        {label && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        )}
        <div className="flex items-end justify-between gap-2">
          {days.map((d, idx) => {
            const pct = Math.max(8, (d.count / resolvedMax) * 100);
            const isPeak = idx === peakIdx;
            return (
              <div
                key={idx}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    "font-mono text-xs tabular-nums",
                    isPeak
                      ? "font-semibold text-card-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {d.count}
                </span>
                <span
                  className={cn(
                    "w-full rounded-sm",
                    isPeak ? "bg-foreground" : "bg-muted"
                  )}
                  style={{ height: `${pct * 0.6}px` }}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
