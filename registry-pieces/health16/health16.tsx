"use client";

import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Health16Props {
  currentWeight?: string;
  goalWeight?: string;
  changeLabel?: string;
  series?: number[];
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const traceClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

const pillClasses: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary/10 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

export const health16Demo: Health16Props = {
  currentWeight: "74.2 kg",
  goalWeight: "Goal 72.0 kg",
  changeLabel: "- 1.8 kg in 30 days",
  series: [76, 75.8, 75.4, 75.6, 75.2, 74.8, 74.4, 74.5, 74.2],
  tone: "emerald",
};

export function Health16({
  currentWeight,
  goalWeight,
  changeLabel,
  series = [],
  tone = "emerald",
  className,
}: Health16Props) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const width = 200;
  const height = 48;
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
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-md",
                iconClasses[tone]
              )}
            >
              <Scale className="size-4" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xl font-bold text-card-foreground">
                {currentWeight}
              </span>
              <span className="text-xs text-muted-foreground">
                {goalWeight}
              </span>
            </div>
          </div>
          {changeLabel && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                pillClasses[tone]
              )}
            >
              {changeLabel}
            </span>
          )}
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={cn("w-full", traceClasses[tone])}
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
      </div>
    </div>
  );
}
