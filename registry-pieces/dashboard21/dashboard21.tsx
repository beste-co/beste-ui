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
  | "rose";

interface Dashboard21Props {
  label?: string;
  value?: number;
  caption?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const arcClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

const RADIUS = 28;
const CIRC = 2 * Math.PI * RADIUS;


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

export const dashboard21Demo: Dashboard21Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Storage used",
  value: 68,
  caption: "34 GB of 50 GB",
  tone: "violet",
};

export function Dashboard21({
  label = "Progress",
  value = 0,
  caption,
  tone = "violet",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard21Props) {
  const pct = Math.max(0, Math.min(100, value));
  const offset = CIRC * (1 - pct / 100);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-center gap-3 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className={cn("relative size-16 shrink-0", arcClasses[tone])}>
          <svg
            viewBox="0 0 64 64"
            className="size-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              strokeWidth="6"
              className="stroke-muted"
            />
            <circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="currentColor"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold tabular-nums">
            {Math.round(pct)}%
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {label}
          </span>
          {caption && (
            <span className="truncate font-mono text-sm">
              {caption}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
