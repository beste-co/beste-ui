"use client";

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

interface Health8Props {
  spo2?: number;
  pulse?: number;
  timestamp?: string;
  label?: string;
  statusLabel?: string;
  tone?: Tone;
  className?: string;
}

const ringClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

const statusClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-700 dark:text-sky-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  violet: "text-violet-700 dark:text-violet-300",
  amber: "text-amber-700 dark:text-amber-300",
  rose: "text-rose-700 dark:text-rose-300",
};

export const health8Demo: Health8Props = {
  spo2: 98,
  pulse: 68,
  timestamp: "Measured just now",
  label: "SpO₂",
  statusLabel: "Normal range",
  tone: "emerald",
};

export function Health8({
  spo2 = 0,
  pulse = 0,
  timestamp,
  label = "SpO₂",
  statusLabel = "Normal range",
  tone = "emerald",
  className,
}: Health8Props) {
  const circumference = 2 * Math.PI * 32;
  const dash = (spo2 / 100) * circumference;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative shrink-0">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            className={cn("-rotate-90", ringClasses[tone])}
            aria-hidden="true"
          >
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              strokeWidth="8"
              className="stroke-muted"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="currentColor"
              strokeDasharray={`${dash} ${circumference}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-xl font-bold text-card-foreground">
              {spo2}
              <span className="text-xs text-muted-foreground">%</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span className={cn("text-sm font-semibold", statusClasses[tone])}>
            {statusLabel}
          </span>
          <span className="text-xs text-muted-foreground">
            Pulse {pulse} bpm
          </span>
          {timestamp && (
            <span className="text-xs text-muted-foreground">
              {timestamp}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
