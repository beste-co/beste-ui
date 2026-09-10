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

interface Dashboard12Props {
  heading?: string;
  cohorts?: string[];
  weeks?: string[];
  retention?: number[][];
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const cellClasses: Record<Tone, string> = {
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

export const dashboard12Demo: Dashboard12Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  heading: "Retention",
  cohorts: ["W0", "W1", "W2", "W3"],
  weeks: ["W0", "W1", "W2", "W3", "W4"],
  retention: [
    [100, 64, 48, 41, 38],
    [100, 71, 55, 46, 0],
    [100, 68, 52, 0, 0],
    [100, 74, 0, 0, 0],
  ],
  tone: "violet",
};

export function Dashboard12({
  heading = "Retention",
  cohorts = [],
  weeks = [],
  retention = [],
  tone = "violet",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard12Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
          {heading}
        </span>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="w-7 shrink-0" aria-hidden="true" />
            {weeks.map((w) => (
              <span
                key={w}
                className="flex-1 text-center font-mono text-xs text-current/60"
              >
                {w}
              </span>
            ))}
          </div>
          {retention.map((row, r) => (
            <div key={r} className="flex items-center gap-1">
              <span className="w-7 shrink-0 font-mono text-xs text-current/60">
                {cohorts[r]}
              </span>
              {row.map((v, c) => {
                if (v === 0) {
                  return <span key={c} className="flex-1" aria-hidden="true" />;
                }
                return (
                  <div
                    key={c}
                    className="relative flex flex-1 items-center justify-center rounded-sm py-1"
                  >
                    <span
                      className={cn(
                        "absolute inset-0 rounded-sm",
                        cellClasses[tone]
                      )}
                      style={{ opacity: Math.max(0.1, v / 100) }}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        "relative font-mono text-xs tabular-nums",
                        v >= 60
                          ? "font-semibold text-white"
                          : ""
                      )}
                    >
                      {v}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
