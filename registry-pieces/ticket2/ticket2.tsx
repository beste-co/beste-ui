"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Ticket2Props {
  movie?: string;
  hall?: string;
  row?: string;
  seat?: string;
  date?: string;
  time?: string;
  format?: string;
  nowShowingLabel?: string;
  rowPrefix?: string;
  seatPrefix?: string;
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

export const ticket2Demo: Ticket2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  movie: "Dune: Part Two",
  hall: "Hall 4",
  row: "J",
  seat: "12",
  date: "Fri Jun 14",
  time: "9:30 PM",
  format: "IMAX",
  nowShowingLabel: "Now Showing",
  rowPrefix: "Row",
  seatPrefix: "Seat",
};

export function Ticket2({
  movie,
  hall,
  row,
  seat,
  date,
  time,
  format,
  nowShowingLabel = "Now Showing",
  rowPrefix = "Row",
  seatPrefix = "Seat",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ticket2Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 overflow-hidden rounded-lg shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex flex-col gap-0.5 p-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-current/60">
            {nowShowingLabel}
          </span>
          <span className="text-base font-bold leading-tight">
            {movie}
          </span>
          <span className="text-xs text-current/60">
            {hall} · {rowPrefix} {row} · {seatPrefix} {seat}
          </span>
        </div>
        <div
          className="border-t border-dashed border-current/15"
          aria-hidden="true"
        />
        <div className="flex items-center justify-between bg-current/10 px-3 py-2 text-xs">
          <span className="font-mono">
            {date} · {time}
          </span>
          {format && (
            <span className="rounded border border-current/15 bg-current/10 px-1.5 py-0.5 font-mono font-semibold uppercase tracking-wide text-current/60">
              {format}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
