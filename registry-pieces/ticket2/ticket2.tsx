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
  bordered: false,
  inverted: false,
  movie: "Dune: Part Two",
  row: "J",
  seat: "12",
  date: "Fri Jun 14",
  time: "9:30 PM",
  format: "IMAX",
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
  nowShowingLabel,
  rowPrefix = "Row",
  seatPrefix = "Seat",
  surface = "card",
  bordered = false,
  inverted = false,
  className,
}: Ticket2Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  const seating = [
    hall,
    row && `${rowPrefix} ${row}`,
    seat && `${seatPrefix} ${seat}`,
  ]
    .filter(Boolean)
    .join(" · ");
  const showing = [date, time].filter(Boolean).join(" · ");

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 overflow-hidden rounded-lg shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex flex-col gap-0.5 p-3">
          {nowShowingLabel && (
            <span className="text-xs font-semibold text-current/60">
              {nowShowingLabel}
            </span>
          )}
          <span className="text-base font-bold leading-tight">
            {movie}
          </span>
          {seating && (
            <span className="text-xs text-current/60">{seating}</span>
          )}
        </div>
        <div
          className="border-t border-dashed border-current/15"
          aria-hidden="true"
        />
        <div className="flex items-center justify-between bg-current/10 px-3 py-2 text-xs">
          <span className="tabular-nums">{showing}</span>
          {format && (
            <span className={cn("rounded bg-current/10 px-1.5 py-0.5 font-semibold text-current/60", bordered && "border border-current/15")}>
              {format}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
