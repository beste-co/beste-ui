"use client";

import { cn } from "@/lib/utils";

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
  className?: string;
}

export const ticket2Demo: Ticket2Props = {
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
  className,
}: Ticket2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-0.5 p-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {nowShowingLabel}
          </span>
          <span className="text-base font-bold leading-tight text-card-foreground">
            {movie}
          </span>
          <span className="text-xs text-muted-foreground">
            {hall} · {rowPrefix} {row} · {seatPrefix} {seat}
          </span>
        </div>
        <div
          className="border-t border-dashed border-border"
          aria-hidden="true"
        />
        <div className="flex items-center justify-between bg-muted px-3 py-2 text-xs">
          <span className="font-mono text-card-foreground">
            {date} · {time}
          </span>
          {format && (
            <span className="rounded border border-border bg-card px-1.5 py-0.5 font-mono font-semibold uppercase tracking-wide text-muted-foreground">
              {format}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
