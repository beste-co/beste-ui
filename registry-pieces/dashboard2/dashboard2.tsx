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

interface Dashboard2Props {
  label?: string;
  value?: string;
  delta?: string;
  values?: number[];
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
  rose: "text-rose-500",
};

const fillClasses: Record<Tone, string> = {
  primary: "fill-primary/15",
  foreground: "fill-foreground/10",
  violet: "fill-violet-500/15",
  emerald: "fill-emerald-500/15",
  sky: "fill-sky-500/15",
  amber: "fill-amber-500/15",
  rose: "fill-rose-500/15",
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

export const dashboard2Demo: Dashboard2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Active users",
  value: "4,821",
  delta: "+6.8%",
  values: [22, 28, 24, 33, 31, 40, 38, 46, 44, 52, 58, 64],
  tone: "violet",
};

export function Dashboard2({
  label = "Metric",
  value = "—",
  delta,
  values = [],
  tone = "violet",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard2Props) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(1, max - min);
  const w = 100;
  const h = 32;
  const points = values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col gap-1 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {label}
          </span>
          {delta && (
            <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {delta}
            </span>
          )}
        </div>
        <span className="font-mono text-xl font-semibold tabular-nums">
          {value}
        </span>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-8 w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points={areaPoints} className={fillClasses[tone]} />
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={strokeClasses[tone]}
          />
        </svg>
      </div>
    </div>
  );
}
