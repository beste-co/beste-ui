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

interface Dashboard14Props {
  label?: string;
  score?: number;
  status?: string;
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

const RADIUS = 32;
const SEMI = Math.PI * RADIUS;


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

export const dashboard14Demo: Dashboard14Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "System health",
  score: 82,
  status: "Healthy",
  tone: "emerald",
};

export function Dashboard14({
  label = "Score",
  score = 0,
  status,
  tone = "emerald",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard14Props) {
  const pct = Math.max(0, Math.min(100, score));
  const offset = SEMI * (1 - pct / 100);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col items-center gap-1 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
          {label}
        </span>
        <div className={cn("relative h-12 w-24", arcClasses[tone])}>
          <svg
            viewBox="0 0 80 44"
            className="size-full"
            aria-hidden="true"
          >
            <path
              d="M 8 40 A 32 32 0 0 1 72 40"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className="stroke-muted"
            />
            <path
              d="M 8 40 A 32 32 0 0 1 72 40"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="currentColor"
              strokeDasharray={SEMI}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="absolute inset-x-0 bottom-0 text-center font-mono text-xl font-semibold tabular-nums">
            {Math.round(pct)}
          </span>
        </div>
        {status && (
          <span className="text-xs text-current/60">{status}</span>
        )}
      </div>
    </div>
  );
}
