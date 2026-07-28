"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface Commerce4Props {
  remaining?: number;
  total?: number;
  watchers?: number;
  className?: string;
}

export const commerce4Demo: Commerce4Props = {
  remaining: 3,
  total: 50,
  watchers: 18,
};

export function Commerce4({
  remaining = 0,
  total = 100,
  watchers,
  className,
}: Commerce4Props) {
  const pct = Math.max(2, Math.min(100, (remaining / Math.max(1, total)) * 100));
  const critical = remaining <= 5;
  const low = remaining <= Math.max(10, total * 0.2);

  const dotColor = critical
    ? "bg-rose-500"
    : low
      ? "bg-amber-500"
      : "bg-emerald-500";
  const textColor = critical
    ? "text-rose-600 dark:text-rose-400"
    : low
      ? "text-amber-600 dark:text-amber-400"
      : "text-emerald-600 dark:text-emerald-400";
  const barColor = critical
    ? "bg-rose-500"
    : low
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-1.5 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={cn("size-2 animate-pulse rounded-full", dotColor)}
              aria-hidden="true"
            />
            <span className={cn("text-xs font-semibold", textColor)}>
              Only {remaining} left in stock
            </span>
          </div>
          {typeof watchers === "number" && (
            <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
              <Flame className="size-3" aria-hidden="true" />
              {watchers} watching
            </span>
          )}
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full", barColor)}
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
