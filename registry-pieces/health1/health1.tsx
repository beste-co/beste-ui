"use client";

import { Heart } from "lucide-react";
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

interface Health1Props {
  bpm?: number;
  status?: string;
  updated?: string;
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

export const health1Demo: Health1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Health1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-2 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
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
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {label}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-bold">
            {bpm}
          </span>
          <span className="text-xs font-medium text-current/60">
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
        <div className="flex items-center justify-between text-xs text-current/60">
          {status && <span>{status}</span>}
          {updated && <span>{updated}</span>}
        </div>
      </div>
    </div>
  );
}
