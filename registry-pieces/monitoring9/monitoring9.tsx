"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose";

interface Monitoring9Props {
  label?: string;
  value?: number;
  unit?: string;
  hint?: string;
  tone?: Tone;
  className?: string;
}

const ringClasses: Record<Tone, string> = {
  neutral: "text-muted-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

export const monitoring9Demo: Monitoring9Props = {
  label: "Cache hit",
  value: 87,
  unit: "%",
  hint: "last 1h",
  tone: "sky",
};

export function Monitoring9({
  label = "Metric",
  value = 0,
  unit = "%",
  hint,
  tone = "sky",
  className,
}: Monitoring9Props) {
  const safe = Math.min(100, Math.max(0, value));
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safe / 100) * circumference;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-60 items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="relative size-14 shrink-0">
          <svg
            viewBox="0 0 64 64"
            className={cn("size-14 -rotate-90", ringClasses[tone])}
            aria-hidden="true"
          >
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              opacity={0.15}
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums text-card-foreground">
            {safe}
            {unit}
          </span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-card-foreground">
            {label}
          </span>
          {hint && (
            <span className="truncate text-xs text-muted-foreground">
              {hint}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
