"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Dashboard30Row {
  label: string;
  value: string;
  delta?: string;
  values: number[];
}

interface Dashboard30Props {
  rows?: Dashboard30Row[];
  tone?: Tone;
  className?: string;
}

const strokeClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  amber: "text-amber-500",
};

function toPoints(values: number[]) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(1, max - min);
  const w = 100;
  const h = 16;
  return values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export const dashboard30Demo: Dashboard30Props = {
  rows: [
    {
      label: "Signups",
      value: "382",
      delta: "+12%",
      values: [14, 18, 16, 22, 24, 28, 32],
    },
    {
      label: "Revenue",
      value: "$18.4K",
      delta: "+6%",
      values: [120, 132, 128, 140, 152, 168, 184],
    },
    {
      label: "MAU",
      value: "9.8K",
      delta: "+3%",
      values: [80, 82, 85, 84, 88, 92, 98],
    },
  ],
  tone: "violet",
};

export function Dashboard30({
  rows = [],
  tone = "violet",
  className,
}: Dashboard30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col divide-y divide-border rounded-md border border-border bg-card shadow-sm">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-3 px-3 py-2"
          >
            <div className="flex w-20 shrink-0 flex-col">
              <span className="text-xs text-muted-foreground">{r.label}</span>
              <span className="font-mono text-sm font-semibold tabular-nums text-card-foreground">
                {r.value}
              </span>
            </div>
            <svg
              viewBox="0 0 100 16"
              className={cn("h-6 flex-1", strokeClasses[tone])}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline
                points={toPoints(r.values)}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {r.delta && (
              <span className="shrink-0 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {r.delta}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
