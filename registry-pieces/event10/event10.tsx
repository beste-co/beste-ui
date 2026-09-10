"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Event10Props {
  event?: string;
  attendee?: string;
  code?: string;
  seat?: string;
  seatLabel?: string;
  gate?: string;
  gateLabel?: string;
  label?: string;
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

export const event10Demo: Event10Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  event: "Design Matters · Day 1",
  attendee: "Beste Sözen",
  code: "DMX-4K91-N8",
  seat: "Floor A",
  seatLabel: "Seat",
  gate: "Gate 2 · 09:00",
  gateLabel: "Gate",
  label: "Admit one",
};

export function Event10({
  event,
  attendee,
  code,
  seat,
  seatLabel = "Seat",
  gate,
  gateLabel = "Gate",
  label = "Admit one",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Event10Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-1 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-current/60">
            {label}
          </span>
          {code && (
            <span className="font-mono text-xs text-current/60">
              {code}
            </span>
          )}
        </div>
        {attendee && (
          <span className="truncate text-lg font-bold tracking-tight">
            {attendee}
          </span>
        )}
        {event && (
          <span className="truncate text-sm text-current/60">
            {event}
          </span>
        )}
        <div className="mt-1 flex items-center gap-4 border-t border-current/15 pt-2 text-xs">
          {seat && (
            <div className="flex flex-col">
              <span className="uppercase tracking-wide text-current/60">
                {seatLabel}
              </span>
              <span className="font-mono font-semibold">
                {seat}
              </span>
            </div>
          )}
          {gate && (
            <div className="flex flex-col">
              <span className="uppercase tracking-wide text-current/60">
                {gateLabel}
              </span>
              <span className="font-mono font-semibold">
                {gate}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
