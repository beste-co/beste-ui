"use client";

import { Heart } from "lucide-react";
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

interface Health1Props {
  bpm?: number;
  status?: string;
  updated?: string;
  label?: string;
  unitLabel?: string;
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

export const health1Demo: Health1Props = {
  bpm: 72,
  status: "Resting · Normal",
  updated: "2 min ago",
  label: "Heart rate",
  unitLabel: "bpm",
  tone: "primary",
};

export function Health1({
  bpm = 0,
  status,
  updated,
  label = "Heart rate",
  unitLabel = "bpm",
  tone = "primary",
  className,
}: Health1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full",
              iconClasses[tone]
            )}
          >
            <Heart
              className="size-4 animate-pulse fill-current"
              aria-hidden="true"
            />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-bold text-card-foreground">
            {bpm}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {unitLabel}
          </span>
        </div>
        <svg
          viewBox="0 0 200 40"
          className={cn("h-8 w-full", traceClasses[tone])}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 0 20 L 30 20 L 38 20 L 46 10 L 54 30 L 62 5 L 70 35 L 78 20 L 110 20 L 118 20 L 126 14 L 134 26 L 142 6 L 150 34 L 158 20 L 200 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {status && <span>{status}</span>}
          {updated && <span>{updated}</span>}
        </div>
      </div>
    </div>
  );
}
