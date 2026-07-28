"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "sunset";

interface Ai18Props {
  label?: string;
  used?: number;
  max?: number;
  usageSuffix?: string;
  tone?: Tone;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
  emerald: "bg-gradient-to-r from-emerald-500 to-teal-500",
  sky: "bg-gradient-to-r from-sky-500 to-indigo-500",
  amber: "bg-gradient-to-r from-amber-500 to-orange-500",
  sunset: "bg-gradient-to-r from-rose-500 to-orange-500",
};

export const ai18Demo: Ai18Props = {
  label: "Context window",
  used: 92000,
  max: 200000,
  usageSuffix: "of window in use",
  tone: "primary",
};

export function Ai18({
  label = "Context window",
  used = 0,
  max = 1,
  usageSuffix = "of window in use",
  tone = "primary",
  className,
}: Ai18Props) {
  const pct = Math.max(0, Math.min(100, (used / Math.max(1, max)) * 100));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-md border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span className="font-mono text-xs tabular-nums text-card-foreground">
            {(used / 1000).toFixed(1)}K / {(max / 1000).toFixed(0)}K
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              barClasses[tone]
            )}
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {Math.round(pct)}% {usageSuffix}
        </span>
      </div>
    </div>
  );
}
