"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
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

export const dashboard22Demo: Dashboard22Props = {
  surface: "card",
  bordered: false,
  inverted: false,
  label: "Weekly sessions",
  actual: 186,
  target: 220,
  max: 300,
  suffix: "",
  tone: "primary",
};

export function Dashboard22({
  label = "Metric",
  actual = 0,
  target = 100,
  max = 100,
  suffix,
  targetMetLabel,
  toTargetLabel,
  maxLabel,
  tone = "primary",
  surface = "card",
  bordered = false,
  inverted = false,
  className,
}: Dashboard22Props) {
  const actualPct = Math.max(0, Math.min(100, (actual / max) * 100));
  const hitTarget = actual >= target;
  const targetNote = hitTarget
    ? targetMetLabel
    : toTargetLabel && `${target - actual}${suffix ?? ""} ${toTargetLabel}`;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold text-current/60">
            {label}
          </span>
          <div className="flex items-baseline gap-1 text-xs">
            <span className="text-sm font-semibold tabular-nums">
              {actual}
              {suffix}
            </span>
            <span className="text-current/60">
              / {target}
              {suffix}
            </span>
          </div>
        </div>
        <div
          className="h-3 w-full overflow-hidden rounded-sm bg-current/10"
          aria-hidden="true"
        >
          <div
            className={cn("h-full rounded-sm", barClasses[tone])}
            style={{ width: `${actualPct}%` }}
          />
        </div>
        {(targetNote || maxLabel) && (
          <div className="flex items-center justify-between text-xs tabular-nums text-current/60">
            <span>{targetNote}</span>
            {maxLabel && (
              <span>
                {maxLabel} {max}
                {suffix}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
