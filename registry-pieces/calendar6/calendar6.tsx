"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Calendar6Day {
  weekday: string;
  day: number;
  today?: boolean;
  events?: number;
}

interface Calendar6Props {
  heading?: string;
  days?: Calendar6Day[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
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

export const calendar6Demo: Calendar6Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  heading: "Apr 20 – Apr 26",
  days: [
    { weekday: "Mon", day: 20, events: 2 },
    { weekday: "Tue", day: 21, events: 1 },
    { weekday: "Wed", day: 22 },
    { weekday: "Thu", day: 23, today: true, events: 3 },
    { weekday: "Fri", day: 24, events: 1 },
    { weekday: "Sat", day: 25 },
    { weekday: "Sun", day: 26, events: 2 },
  ],
};

export function Calendar6({
  heading,
  days = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Calendar6Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {heading && (
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {heading}
          </span>
        )}
        <div className="flex items-stretch justify-between gap-1">
          {days.map((d, idx) => (
            <div
              key={idx}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg border px-1 py-2",
                d.today
                  ? "border-primary bg-primary/10"
                  : "border-current/15"
              )}
            >
              <span className="text-xs font-medium uppercase tracking-wide text-current/60">
                {d.weekday}
              </span>
              <span
                className={cn(
                  "font-mono text-base font-semibold",
                  d.today ? "text-primary" : ""
                )}
              >
                {d.day}
              </span>
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: d.events ?? 0 }).map((_, i) => (
                  <span
                    key={i}
                    className="size-1 rounded-full bg-sky-500"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
