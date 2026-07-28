"use client";

import { cn } from "@/lib/utils";

interface Ticket4Props {
  number?: string;
  event?: string;
  drawDate?: string;
  numberLabel?: string;
  kindLabel?: string;
  className?: string;
}

export const ticket4Demo: Ticket4Props = {
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
  className,
}: Ticket4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col items-center justify-center bg-muted px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {numberLabel}
          </span>
          <span className="font-mono text-2xl font-bold tabular-nums text-card-foreground">
            {number}
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-0.5 p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {kindLabel}
          </span>
          <span className="text-base font-bold leading-tight text-card-foreground">
            {event}
          </span>
          {drawDate && (
            <span className="text-xs text-muted-foreground">{drawDate}</span>
          )}
        </div>
      </div>
    </div>
  );
}
