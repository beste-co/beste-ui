"use client";

import { Target } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Dashboard13Props {
  label?: string;
  current?: string;
  target?: string;
  ofLabel?: string;
  progress?: number;
  remaining?: string;
  deadline?: string;
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

export const dashboard13Demo: Dashboard13Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Q2 revenue goal",
  current: "$148K",
  target: "$240K",
  ofLabel: "of",
  progress: 62,
  remaining: "$92K to goal",
  deadline: "28 days left",
  tone: "emerald",
};

export function Dashboard13({
  label = "Goal",
  current = "—",
  target = "—",
  ofLabel = "of",
  progress = 0,
  remaining,
  deadline,
  tone = "violet",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard13Props) {
  const pct = Math.max(0, Math.min(100, progress));

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-1.5">
          <Target
            className="size-3.5 text-current/60"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {label}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-xl font-semibold tabular-nums">
            {current}
          </span>
          <span className="font-mono text-xs tabular-nums text-current/60">
            {ofLabel} {target}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-current/10">
          <div
            className={cn("h-full rounded-full", barClasses[tone])}
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="flex items-center justify-between font-mono text-xs text-current/60">
          {remaining && <span>{remaining}</span>}
          {deadline && <span>{deadline}</span>}
        </div>
      </div>
    </div>
  );
}
