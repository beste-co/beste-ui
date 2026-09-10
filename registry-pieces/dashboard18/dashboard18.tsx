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

interface Dashboard18Props {
  title?: string;
  current?: number[];
  previous?: number[];
  currentLabel?: string;
  previousLabel?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const strokeClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  amber: "text-amber-500",
};

const dotClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

function toPoints(values: number[], max: number, min: number) {
  const w = 100;
  const h = 40;
  const range = Math.max(1, max - min);
  return values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}


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

export const dashboard18Demo: Dashboard18Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Sessions",
  currentLabel: "This week",
  previousLabel: "Last week",
  current: [22, 28, 24, 33, 31, 40, 46],
  previous: [18, 21, 26, 25, 29, 32, 30],
  tone: "violet",
};

export function Dashboard18({
  title = "Trend",
  current = [],
  previous = [],
  currentLabel = "This period",
  previousLabel = "Previous",
  tone = "violet",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard18Props) {
  const all = [...current, ...previous];
  const max = Math.max(...all, 1);
  const min = Math.min(...all, 0);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-1 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
          {title}
        </span>
        <svg
          viewBox="0 0 100 40"
          className={cn("h-10 w-full", strokeClasses[tone])}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline
            points={toPoints(previous, max, min)}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeDasharray="2 2"
            strokeWidth="1.5"
          />
          <polyline
            points={toPoints(current, max, min)}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        <div className="flex items-center gap-3 text-xs text-current/60">
          <span className="flex items-center gap-1">
            <span
              className={cn("size-1.5 rounded-full", dotClasses[tone])}
              aria-hidden="true"
            />
            {currentLabel}
          </span>
          <span className="flex items-center gap-1">
            <span
              className="size-1.5 rounded-full bg-current/25"
              aria-hidden="true"
            />
            {previousLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
