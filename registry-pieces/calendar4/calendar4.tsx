"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Calendar4Props {
  weekday?: string;
  date?: string;
  time?: string;
  relative?: string;
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

export const calendar4Demo: Calendar4Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  weekday: "Thu",
  date: "Apr 23",
  time: "14:00",
  relative: "Today",
};

export function Calendar4({
  weekday,
  date,
  time,
  relative,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Calendar4Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-3 rounded-full px-4 py-1.5 pl-2 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {relative && (
          <>
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              {relative}
            </span>
            <span
              className="h-3 w-px bg-border"
              aria-hidden="true"
            />
          </>
        )}
        {weekday && (
          <span className="text-xs font-semibold uppercase tracking-widest text-current/60">
            {weekday}
          </span>
        )}
        {date && (
          <span className="font-mono text-sm font-bold">
            {date}
          </span>
        )}
        {time && (
          <>
            <span
              className="h-3 w-px bg-border"
              aria-hidden="true"
            />
            <span className="font-mono text-sm text-current/60">
              {time}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
