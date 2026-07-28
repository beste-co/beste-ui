"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

type SeatState = "available" | "selected" | "taken" | "exit";

interface Seat {
  label: string;
  state: SeatState;
}

interface Travel14Props {
  row?: number;
  seats?: Seat[];
  selectedLabel?: string;
  className?: string;
}

export const travel14Demo: Travel14Props = {
  row: 12,
  seats: [
    { label: "A", state: "available" },
    { label: "B", state: "taken" },
    { label: "C", state: "available" },
    { label: "D", state: "selected" },
    { label: "E", state: "available" },
    { label: "F", state: "exit" },
  ],
  selectedLabel: "12D · Window",
};

const stateClasses: Record<SeatState, string> = {
  available: "border-border bg-card text-card-foreground",
  selected: "border-emerald-500 bg-emerald-500 text-white",
  taken: "border-border bg-muted text-muted-foreground",
  exit: "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export function Travel14({
  row = 1,
  seats = [],
  selectedLabel,
  className,
}: Travel14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-4 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wide text-muted-foreground">
            Row {row}
          </span>
          {selectedLabel && (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono font-semibold text-emerald-700 dark:text-emerald-300">
              {selectedLabel}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center gap-1">
          {seats.map((seat, idx) => (
            <Fragment key={seat.label}>
              {idx === 3 && (
                <span
                  className="mx-1 text-xs text-muted-foreground"
                  aria-hidden="true"
                >
                  ·
                </span>
              )}
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-t-lg border-2 font-mono text-sm font-semibold",
                  stateClasses[seat.state]
                )}
              >
                {seat.label}
              </div>
            </Fragment>
          ))}
        </div>
        <div className="flex items-center justify-center text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span
                className="size-2 rounded border border-border bg-card"
                aria-hidden="true"
              />
              Open
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="size-2 rounded bg-emerald-500" aria-hidden="true" />
              Yours
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="size-2 rounded bg-muted" aria-hidden="true" />
              Taken
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
