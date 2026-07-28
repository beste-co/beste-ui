"use client";

import { cn } from "@/lib/utils";

interface Ticket1Props {
  event?: string;
  date?: string;
  time?: string;
  seat?: string;
  admitLabel?: string;
  oneLabel?: string;
  className?: string;
}

export const ticket1Demo: Ticket1Props = {
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
  className,
}: Ticket1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-1 flex-col gap-1 p-3">
          {date && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {date}
            </span>
          )}
          {event && (
            <span className="text-base font-bold leading-tight text-card-foreground">
              {event}
            </span>
          )}
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            {time && <span>{time}</span>}
            {time && seat && (
              <span className="size-1 rounded-full bg-muted-foreground/40" />
            )}
            {seat && <span className="truncate">{seat}</span>}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-0.5 border-l-2 border-dashed border-border bg-muted px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {admitLabel}
          </span>
          <span className="text-sm font-bold text-card-foreground">
            {oneLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
