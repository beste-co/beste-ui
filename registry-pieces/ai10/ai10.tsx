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

interface Ai10Props {
  label?: string;
  used?: number;
  quota?: number;
  resetsIn?: string;
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

const RADIUS = 18;
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

export const ai10Demo: Ai10Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Monthly requests",
  used: 4200,
  quota: 10000,
  resetsIn: "resets in 12d",
  tone: "violet",
};

export function Ai10({
  label = "Requests",
  used = 0,
  quota = 1000,
  resetsIn,
  tone = "violet",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ai10Props) {
  const pct = Math.max(0, Math.min(100, (used / Math.max(1, quota)) * 100));
  const offset = CIRC * (1 - pct / 100);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-72 items-center gap-3 rounded-md p-3 shadow-sm",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div
          className={cn(
            "relative flex size-11 shrink-0 items-center justify-center",
            arcClasses[tone]
          )}
        >
          <svg
            className="absolute inset-0 size-11 -rotate-90"
            viewBox="0 0 44 44"
            aria-hidden="true"
          >
            <circle
              cx="22"
              cy="22"
              r={RADIUS}
              fill="none"
              strokeWidth="4"
              className="stroke-muted"
            />
            <circle
              cx="22"
              cy="22"
              r={RADIUS}
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="relative font-mono text-xs font-semibold tabular-nums">
            {Math.round(pct)}%
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-xs font-semibold uppercase tracking-wide text-current/60">
            {label}
          </span>
          <span className="font-mono text-sm tabular-nums">
            {used.toLocaleString()}{" "}
            <span className="text-current/60">
              / {quota.toLocaleString()}
            </span>
          </span>
          {resetsIn && (
            <span className="truncate text-xs text-current/60">
              {resetsIn}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
