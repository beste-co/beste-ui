"use client";

import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-current/10 text-foreground",
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


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const health2Demo: Health2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Health2Props) {
  const config = statusConfig[status];

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-2 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
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
            <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
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
          <span className="font-mono text-3xl font-bold">
            {systolic}
          </span>
          <span className="text-current/60">/</span>
          <span className="font-mono text-2xl font-semibold text-current/60">
            {diastolic}
          </span>
          <span className="ml-1 text-xs text-current/60">
            {unitLabel}
          </span>
        </div>
        {measured && (
          <span className="border-t border-current/15 pt-2 text-xs text-current/60">
            {measured}
          </span>
        )}
      </div>
    </div>
  );
}
