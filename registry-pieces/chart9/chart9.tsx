"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Row {
  label: string;
  value: number;
}

interface Chart9Props {
  title?: string;
  unit?: string;
  rows?: Row[];
  intervalMs?: number;
  tone?: Tone;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

const dotClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

export const chart9Demo: Chart9Props = {
  title: "Most played right now",
  unit: "plays",
  rows: [
    { label: "Nina Simone", value: 8420 },
    { label: "Miles Davis", value: 7910 },
    { label: "Björk", value: 7280 },
  ],
  tone: "primary",
};

export function Chart9({
  title = "Leaderboard",
  unit = "",
  rows = [],
  intervalMs = 1600,
  tone = "primary",
  className,
}: Chart9Props) {
  const [values, setValues] = useState<number[]>(() => rows.map((r) => r.value));

  useEffect(() => {
    if (!rows.length) return;
    const id = setInterval(() => {
      setValues((prev) =>
        prev.map((v) => Math.max(1, Math.round(v * (1 + (Math.random() - 0.5) * 0.22))))
      );
    }, intervalMs);
    return () => clearInterval(id);
  }, [rows.length, intervalMs]);

  const series = values.length === rows.length ? values : rows.map((r) => r.value);
  const order = series.map((_, i) => i).sort((a, b) => series[b] - series[a]);
  const rank = new Array<number>(series.length);
  order.forEach((idx, r) => {
    rank[idx] = r;
  });
  const max = Math.max(1, ...series);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-sm font-medium text-card-foreground">{title}</span>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            <span className="relative flex size-1.5" aria-hidden="true">
              <span
                className={cn(
                  "absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:animate-none",
                  dotClasses[tone]
                )}
              />
              <span className={cn("relative inline-flex size-1.5 rounded-full", dotClasses[tone])} />
            </span>
            Live
          </span>
        </div>

        <div className="relative" style={{ height: `${rows.length * 2.25 - 0.25}rem` }}>
          {rows.map((row, i) => {
            const value = series[i] ?? row.value;
            const leader = rank[i] === 0;
            return (
              <div
                key={row.label}
                className="absolute inset-x-0 top-0 flex h-8 items-center gap-2 transition-transform duration-700 ease-in-out motion-reduce:transition-none"
                style={{ transform: `translateY(${rank[i] * 2.25}rem)` }}
              >
                <span
                  className={cn(
                    "w-20 shrink-0 truncate text-xs transition-colors duration-500",
                    leader ? "font-semibold text-card-foreground" : "text-muted-foreground"
                  )}
                >
                  {row.label}
                </span>
                <div className="flex-1">
                  <div
                    className={cn(
                      "h-5 rounded-md transition-all duration-700 ease-in-out motion-reduce:transition-none",
                      barClasses[tone],
                      leader ? "opacity-100" : "opacity-50"
                    )}
                    style={{ width: `${(value / max) * 100}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {value.toLocaleString("en-US")}
                </span>
              </div>
            );
          })}
        </div>

        {unit && (
          <span className="text-xs text-muted-foreground">
            {unit}, updates every {(intervalMs / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 })}s
          </span>
        )}
      </div>
    </div>
  );
}
