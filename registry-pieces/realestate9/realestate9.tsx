"use client";

import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Realestate9Props {
  label?: string;
  current?: string;
  oneYear?: string;
  fiveYear?: string;
  series?: number[];
  tone?: Tone;
  className?: string;
}

const chartClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

const pillClasses: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

export const realestate9Demo: Realestate9Props = {
  label: "Estimated value",
  current: "$1,240,000",
  oneYear: "+4.2% 1y",
  fiveYear: "+28.7% 5y",
  series: [960, 980, 1020, 1060, 1080, 1140, 1180, 1240],
  tone: "primary",
};

export function Realestate9({
  label,
  current,
  oneYear,
  fiveYear,
  series = [],
  tone = "primary",
  className,
}: Realestate9Props) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const width = 200;
  const height = 40;
  const step = series.length > 1 ? width / (series.length - 1) : 0;
  const path = series
    .map((v, idx) => {
      const x = idx * step;
      const y = height - ((v - min) / span) * height;
      return `${idx === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
          )}
          {oneYear && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                pillClasses[tone]
              )}
            >
              <TrendingUp className="size-3" aria-hidden="true" />
              {oneYear}
            </span>
          )}
        </div>
        {current && (
          <span className="font-mono text-2xl font-bold text-card-foreground">
            {current}
          </span>
        )}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={cn("h-10 w-full", chartClasses[tone])}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {fiveYear && (
          <span className="text-sm text-muted-foreground">{fiveYear}</span>
        )}
      </div>
    </div>
  );
}
