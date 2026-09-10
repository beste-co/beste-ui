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

interface Dashboard24Props {
  title?: string;
  peak?: string;
  values?: number[];
  hourLabels?: string[];
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const fillClasses: Record<Tone, string> = {
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

export const dashboard24Demo: Dashboard24Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Last 24h",
  peak: "peak at 14:00",
  values: [
    2, 1, 0, 0, 1, 2, 4, 8, 14, 22, 28, 34, 38, 42, 48, 40, 36, 30, 22, 18, 14,
    10, 6, 4,
  ],
  hourLabels: ["00", "06", "12", "18", "24"],
  tone: "violet",
};

export function Dashboard24({
  title = "24h activity",
  peak,
  values = [],
  hourLabels = ["00", "06", "12", "18", "24"],
  tone = "violet",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard24Props) {
  const max = Math.max(...values, 1);

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
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {title}
          </span>
          {peak && (
            <span className="font-mono text-xs text-current/60">
              {peak}
            </span>
          )}
        </div>
        <div className="flex h-8 items-end gap-0.5">
          {values.map((v, i) => {
            const h = Math.max(6, (v / max) * 100);
            return (
              <span
                key={i}
                className={cn("flex-1 rounded-sm", fillClasses[tone])}
                style={{ height: `${h}%`, opacity: Math.max(0.3, v / max) }}
                aria-hidden="true"
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between font-mono text-xs text-current/60">
          {hourLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
