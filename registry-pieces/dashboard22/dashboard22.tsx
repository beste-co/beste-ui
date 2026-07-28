"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Dashboard22Props {
  label?: string;
  actual?: number;
  target?: number;
  max?: number;
  suffix?: string;
  targetMetLabel?: string;
  toTargetLabel?: string;
  maxLabel?: string;
  tone?: Tone;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

export const dashboard22Demo: Dashboard22Props = {
  label: "Weekly sessions",
  actual: 186,
  target: 220,
  max: 300,
  suffix: "",
  targetMetLabel: "Target met",
  toTargetLabel: "to target",
  maxLabel: "max",
  tone: "emerald",
};

export function Dashboard22({
  label = "Metric",
  actual = 0,
  target = 100,
  max = 100,
  suffix,
  targetMetLabel = "Target met",
  toTargetLabel = "to target",
  maxLabel = "max",
  tone = "violet",
  className,
}: Dashboard22Props) {
  const actualPct = Math.max(0, Math.min(100, (actual / max) * 100));
  const hitTarget = actual >= target;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <div className="flex items-baseline gap-1 font-mono text-xs">
            <span className="text-sm font-semibold tabular-nums text-card-foreground">
              {actual}
              {suffix}
            </span>
            <span className="text-muted-foreground">
              / {target}
              {suffix}
            </span>
          </div>
        </div>
        <div
          className="h-3 w-full overflow-hidden rounded-sm bg-muted"
          aria-hidden="true"
        >
          <div
            className={cn("h-full rounded-sm", barClasses[tone])}
            style={{ width: `${actualPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {hitTarget
              ? targetMetLabel
              : `${target - actual}${suffix} ${toTargetLabel}`}
          </span>
          <span>
            {maxLabel} {max}
            {suffix}
          </span>
        </div>
      </div>
    </div>
  );
}
