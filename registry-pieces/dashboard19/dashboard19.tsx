"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Dashboard19Row {
  stars: number;
  count: number;
}

interface Dashboard19Props {
  average?: number;
  total?: number;
  reviewsLabel?: string;
  rows?: Dashboard19Row[];
  className?: string;
}

export const dashboard19Demo: Dashboard19Props = {
  average: 4.6,
  total: 1284,
  reviewsLabel: "reviews",
  rows: [
    { stars: 5, count: 980 },
    { stars: 4, count: 208 },
    { stars: 3, count: 62 },
    { stars: 2, count: 24 },
    { stars: 1, count: 10 },
  ],
};

export function Dashboard19({
  average = 0,
  total = 0,
  reviewsLabel = "reviews",
  rows = [],
  className,
}: Dashboard19Props) {
  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-xl font-semibold tabular-nums text-card-foreground">
              {average.toFixed(1)}
            </span>
            <Star
              className="size-3.5 fill-amber-500 text-amber-500"
              aria-hidden="true"
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {total.toLocaleString()} {reviewsLabel}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          {rows.map((r) => {
            const pct = (r.count / max) * 100;
            return (
              <div
                key={r.stars}
                className="flex items-center gap-2 text-xs"
              >
                <span className="w-3 shrink-0 font-mono text-card-foreground">
                  {r.stars}
                </span>
                <Star
                  className="size-3 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <div className="flex-1 overflow-hidden rounded-sm bg-muted">
                  <div
                    className="h-1.5 rounded-sm bg-amber-500"
                    style={{ width: `${pct}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="w-12 shrink-0 text-right font-mono tabular-nums text-muted-foreground">
                  {r.count.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
