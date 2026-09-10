"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Stop {
  time: string;
  title: string;
  place: string;
}

interface Travel3Props {
  day?: number;
  destination?: string;
  date?: string;
  stops?: Stop[];
  dayLabel?: string;
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

export const travel3Demo: Travel3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  day: 3,
  destination: "Lisbon",
  date: "Sat, Jun 14",
  dayLabel: "Day",
  stops: [
    { time: "09:00", title: "Time Out Market", place: "Cais do Sodré" },
    { time: "12:30", title: "Ride Tram 28", place: "Praça Luís Camões" },
    { time: "18:00", title: "Miradouro sunset", place: "Graça" },
  ],
};

export function Travel3({
  day,
  destination,
  date,
  stops = [],
  dayLabel = "Day",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Travel3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
              {dayLabel} {day}
            </span>
            <span className="text-sm font-semibold">
              {destination}
            </span>
          </div>
          {date && (
            <span className="text-xs text-current/60">{date}</span>
          )}
        </div>
        <div className="flex flex-col">
          {stops.map((stop, idx) => (
            <div
              key={idx}
              className="relative flex items-start gap-3 pb-3 last:pb-0"
            >
              {idx < stops.length - 1 && (
                <span
                  className="absolute bottom-0 left-1.5 top-5 w-px bg-border"
                  aria-hidden="true"
                />
              )}
              <span className="mt-1 flex size-3.5 shrink-0 items-center justify-center rounded-full border-2 border-sky-500 bg-current/10">
                <span
                  className="size-1.5 rounded-full bg-sky-500"
                  aria-hidden="true"
                />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-xs text-current/60">
                  {stop.time}
                </span>
                <span className="text-sm font-medium">
                  {stop.title}
                </span>
                <span className="text-xs text-current/60">
                  {stop.place}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
