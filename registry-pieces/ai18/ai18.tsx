"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
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

export const ai18Demo: Ai18Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ai18Props) {
  const pct = Math.max(0, Math.min(100, (used / Math.max(1, max)) * 100));

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-2 rounded-md px-3 py-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {label}
          </span>
          <span className="font-mono text-xs tabular-nums">
            {(used / 1000).toFixed(1)}K / {(max / 1000).toFixed(0)}K
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-current/10">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              barClasses[tone]
            )}
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        <span className="text-xs text-current/60">
          {Math.round(pct)}% {usageSuffix}
        </span>
      </div>
    </div>
  );
}
