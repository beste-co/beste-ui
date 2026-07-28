"use client";

import { cn } from "@/lib/utils";

interface Event10Props {
  event?: string;
  attendee?: string;
  code?: string;
  seat?: string;
  seatLabel?: string;
  gate?: string;
  gateLabel?: string;
  label?: string;
  className?: string;
}

export const event10Demo: Event10Props = {
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
  className,
}: Event10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          {code && (
            <span className="font-mono text-xs text-muted-foreground">
              {code}
            </span>
          )}
        </div>
        {attendee && (
          <span className="truncate text-lg font-bold tracking-tight text-card-foreground">
            {attendee}
          </span>
        )}
        {event && (
          <span className="truncate text-sm text-muted-foreground">
            {event}
          </span>
        )}
        <div className="mt-1 flex items-center gap-4 border-t border-border pt-2 text-xs">
          {seat && (
            <div className="flex flex-col">
              <span className="uppercase tracking-wide text-muted-foreground">
                {seatLabel}
              </span>
              <span className="font-mono font-semibold text-card-foreground">
                {seat}
              </span>
            </div>
          )}
          {gate && (
            <div className="flex flex-col">
              <span className="uppercase tracking-wide text-muted-foreground">
                {gateLabel}
              </span>
              <span className="font-mono font-semibold text-card-foreground">
                {gate}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
