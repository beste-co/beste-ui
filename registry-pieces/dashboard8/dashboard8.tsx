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

interface Dashboard8Day {
  label: string;
  value: number;
  today?: boolean;
}

interface Dashboard8Props {
  title?: string;
  total?: string;
  days?: Dashboard8Day[];
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

const mutedBarClasses: Record<Tone, string> = {
  primary: "bg-primary/30",
  foreground: "bg-current/25",
  violet: "bg-violet-500/30",
  emerald: "bg-emerald-500/30",
  sky: "bg-sky-500/30",
  amber: "bg-amber-500/30",
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

export const dashboard8Demo: Dashboard8Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Events this week",
  total: "2,840",
  days: [
    { label: "Mon", value: 280 },
    { label: "Tue", value: 410 },
    { label: "Wed", value: 520 },
    { label: "Thu", value: 340 },
    { label: "Fri", value: 680 },
    { label: "Sat", value: 480 },
    { label: "Sun", value: 130, today: true },
  ],
  tone: "violet",
};

export function Dashboard8({
  title = "This week",
  total,
  days = [],
  tone = "violet",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard8Props) {
  const max = Math.max(...days.map((d) => d.value), 1);

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
          {total && (
            <span className="font-mono text-sm font-semibold tabular-nums">
              {total}
            </span>
          )}
        </div>
        <div className="flex h-14 items-end gap-1.5">
          {days.map((d) => {
            const h = (d.value / max) * 100;
            return (
              <div
                key={d.label}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div className="flex h-10 w-full items-end">
                  <span
                    className={cn(
                      "w-full rounded-sm",
                      d.today ? barClasses[tone] : mutedBarClasses[tone]
                    )}
                    style={{ height: `${Math.max(6, h)}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span
                  className={cn(
                    "text-xs",
                    d.today
                      ? "font-semibold"
                      : "text-current/60"
                  )}
                >
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
