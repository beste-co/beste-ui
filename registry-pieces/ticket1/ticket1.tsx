"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Ticket1Props {
  event?: string;
  date?: string;
  time?: string;
  seat?: string;
  admitLabel?: string;
  oneLabel?: string;
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

export const ticket1Demo: Ticket1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  event: "Midnight Synth Tour",
  date: "Fri, Jun 14",
  time: "8:00 PM",
  seat: "Row C · Seat 12",
  admitLabel: "Admit",
  oneLabel: "ONE",
};

export function Ticket1({
  event,
  date,
  time,
  seat,
  admitLabel = "Admit",
  oneLabel = "ONE",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ticket1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 overflow-hidden rounded-lg shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex flex-1 flex-col gap-1 p-3">
          {date && (
            <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
              {date}
            </span>
          )}
          {event && (
            <span className="text-base font-bold leading-tight">
              {event}
            </span>
          )}
          <div className="mt-1 flex items-center gap-3 text-xs text-current/60">
            {time && <span>{time}</span>}
            {time && seat && (
              <span className="size-1 rounded-full bg-current/15" />
            )}
            {seat && <span className="truncate">{seat}</span>}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-0.5 border-l-2 border-dashed border-current/15 bg-current/10 px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-current/60">
            {admitLabel}
          </span>
          <span className="text-sm font-bold">
            {oneLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
