"use client";

import { Activity } from "lucide-react";
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

type BPStatus = "normal" | "elevated" | "high" | "low";

interface Health2Props {
  systolic?: number;
  diastolic?: number;
  status?: BPStatus;
  statusLabel?: string;
  measured?: string;
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

const statusConfig: Record<
  BPStatus,
  { label: string; pill: string; dot: string }
> = {
  normal: {
    label: "Normal",
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  elevated: {
    label: "Elevated",
    pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  high: {
    label: "Stage 2 high",
    pill: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  low: {
    label: "Low",
    pill: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    dot: "bg-sky-500",
  },
};

export const health2Demo: Health2Props = {
  systolic: 118,
  diastolic: 76,
  status: "normal",
  statusLabel: "Normal",
  measured: "Measured at 08:42",
  label: "Blood pressure",
  unitLabel: "mmHg",
  tone: "neutral",
};

export function Health2({
  systolic = 0,
  diastolic = 0,
  status = "normal",
  statusLabel,
  measured,
  label = "Blood pressure",
  unitLabel = "mmHg",
  tone = "neutral",
  className,
}: Health2Props) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full",
                iconClasses[tone]
              )}
            >
              <Activity className="size-4" aria-hidden="true" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold",
              config.pill
            )}
          >
            <span
              className={cn("size-1.5 rounded-full", config.dot)}
              aria-hidden="true"
            />
            {statusLabel ?? config.label}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-3xl font-bold text-card-foreground">
            {systolic}
          </span>
          <span className="text-muted-foreground">/</span>
          <span className="font-mono text-2xl font-semibold text-muted-foreground">
            {diastolic}
          </span>
          <span className="ml-1 text-xs text-muted-foreground">
            {unitLabel}
          </span>
        </div>
        {measured && (
          <span className="border-t border-border pt-2 text-xs text-muted-foreground">
            {measured}
          </span>
        )}
      </div>
    </div>
  );
}
