"use client";

import { cn } from "@/lib/utils";

interface Ticket9Props {
  league?: string;
  homeTeam?: string;
  awayTeam?: string;
  section?: string;
  row?: string;
  seat?: string;
  gate?: string;
  time?: string;
  className?: string;
}

export const ticket9Demo: Ticket9Props = {
  league: "NBA · Game 5",
  homeTeam: "Lakers",
  awayTeam: "Warriors",
  section: "112",
  row: "8",
  seat: "14",
  gate: "3",
  time: "7:30 PM",
};

export function Ticket9({
  league,
  homeTeam,
  awayTeam,
  section,
  row,
  seat,
  gate,
  time,
  className,
}: Ticket9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-1 p-3">
          {league && (
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {league}
            </span>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="text-base font-bold leading-tight text-card-foreground">
              {homeTeam}
            </span>
            <span
              className="text-xs uppercase tracking-widest text-muted-foreground"
              aria-hidden="true"
            >
              vs
            </span>
            <span className="text-base font-bold leading-tight text-card-foreground">
              {awayTeam}
            </span>
          </div>
        </div>
        <div
          className="border-t border-dashed border-border"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-0.5 bg-muted px-3 py-1.5 text-xs">
          <span className="font-mono text-card-foreground">
            Sec {section} · Row {row} · Seat {seat}
          </span>
          <div className="flex items-center justify-between text-muted-foreground">
            {gate && <span>Gate {gate}</span>}
            {time && <span>{time}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
