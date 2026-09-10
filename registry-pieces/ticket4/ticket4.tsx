"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Ticket4Props {
  number?: string;
  event?: string;
  drawDate?: string;
  numberLabel?: string;
  kindLabel?: string;
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

export const ticket4Demo: Ticket4Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  number: "0427",
  event: "Annual Gala Raffle",
  drawDate: "Draw · Jun 14",
  numberLabel: "No.",
  kindLabel: "Raffle",
};

export function Ticket4({
  number,
  event,
  drawDate,
  numberLabel = "No.",
  kindLabel = "Raffle",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ticket4Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 overflow-hidden rounded-lg shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex flex-col items-center justify-center bg-current/10 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-current/60">
            {numberLabel}
          </span>
          <span className="font-mono text-2xl font-bold tabular-nums">
            {number}
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-0.5 p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {kindLabel}
          </span>
          <span className="text-base font-bold leading-tight">
            {event}
          </span>
          {drawDate && (
            <span className="text-xs text-current/60">{drawDate}</span>
          )}
        </div>
      </div>
    </div>
  );
}
