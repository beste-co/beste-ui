"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Kpi {
  label: string;
  value: string;
  delta?: string;
  negative?: boolean;
}

interface Stats19Props {
  caption?: string;
  items?: Kpi[];
  intervalMs?: number;
  bordered?: boolean;
  className?: string;
}

export const stats19Demo: Stats19Props = {
  items: [
    { label: "Revenue", value: "$128,400", delta: "+12.4%" },
    { label: "Signups", value: "1,284", delta: "+8.1%" },
    { label: "Churn", value: "2.1%", delta: "-0.4 pt" },
    { label: "NPS", value: "62", delta: "-3", negative: true },
  ],
  bordered: false,
};

export function Stats19({
  caption,
  items = [],
  intervalMs = 2000,
  bordered = false,
  className,
}: Stats19Props) {
  const [state, setState] = useState<{ index: number; prev: number | null }>({
    index: 0,
    prev: null,
  });

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setState((s) => ({ index: (s.index + 1) % items.length, prev: s.index }));
    }, intervalMs);
    return () => clearInterval(id);
  }, [items.length, intervalMs]);

  const current = items[state.index];
  const previous = state.prev === null ? null : items[state.prev];

  const renderRow = (kpi: Kpi) => (
    <>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-xs text-muted-foreground">{kpi.label}</span>
        <span className="truncate text-2xl font-semibold tabular-nums text-card-foreground">
          {kpi.value}
        </span>
      </div>
      {kpi.delta && (
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums",
            kpi.negative
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          )}
        >
          {kpi.delta}
        </span>
      )}
    </>
  );

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes stats19-in { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: none; } } @keyframes stats19-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(-100%); } }`}</style>
      <div className={cn("flex w-full max-w-72 flex-col gap-2 rounded-xl bg-card p-4 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between">
          {caption && (
            <span className="text-xs text-muted-foreground">{caption}</span>
          )}
          <span className="ml-auto flex items-center gap-1" aria-hidden="true">
            {items.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "size-1.5 rounded-full transition-colors duration-300",
                  i === state.index ? "bg-foreground" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </span>
        </div>

        <div className="relative h-12 overflow-hidden">
          {previous && (
            <div
              key={`out-${state.index}`}
              className="absolute inset-0 flex items-center justify-between gap-3"
              style={{ animation: "stats19-out 500ms ease-in forwards" }}
              aria-hidden="true"
            >
              {renderRow(previous)}
            </div>
          )}
          {current && (
            <div
              key={`in-${state.index}`}
              className="absolute inset-0 flex items-center justify-between gap-3"
              style={{ animation: "stats19-in 500ms ease-out" }}
            >
              {renderRow(current)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
