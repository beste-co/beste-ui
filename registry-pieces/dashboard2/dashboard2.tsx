"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Dashboard2Props {
  label?: string;
  value?: string;
  delta?: string;
  values?: number[];
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
  rose: "text-rose-500",
};

const fillClasses: Record<Tone, string> = {
  primary: "fill-primary/15",
  foreground: "fill-foreground/10",
  violet: "fill-violet-500/15",
  emerald: "fill-emerald-500/15",
  sky: "fill-sky-500/15",
  amber: "fill-amber-500/15",
  rose: "fill-rose-500/15",
};

export const dashboard2Demo: Dashboard2Props = {
  label: "Active users",
  value: "4,821",
  delta: "+6.8%",
  values: [22, 28, 24, 33, 31, 40, 38, 46, 44, 52, 58, 64],
  tone: "violet",
};

export function Dashboard2({
  label = "Metric",
  value = "—",
  delta,
  values = [],
  tone = "violet",
  className,
}: Dashboard2Props) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(1, max - min);
  const w = 100;
  const h = 32;
  const points = values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-1 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          {delta && (
            <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {delta}
            </span>
          )}
        </div>
        <span className="font-mono text-xl font-semibold tabular-nums text-card-foreground">
          {value}
        </span>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-8 w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points={areaPoints} className={fillClasses[tone]} />
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={strokeClasses[tone]}
          />
        </svg>
      </div>
    </div>
  );
}
