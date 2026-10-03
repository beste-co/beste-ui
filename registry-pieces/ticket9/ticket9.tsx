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
  bordered?: boolean;
  className?: string;
}

export const ticket9Demo: Ticket9Props = {
  homeTeam: "Lakers",
  awayTeam: "Warriors",
  section: "112",
  row: "8",
  seat: "14",
  time: "7:30 PM",
  bordered: false,
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
  bordered = false,
  className,
}: Ticket9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 overflow-hidden rounded-lg bg-card shadow-sm", bordered && "border border-border")}>
        <div className="flex flex-col gap-1 p-3">
          {league && (
            <span className="text-xs font-semibold text-muted-foreground">
              {league}
            </span>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="text-base font-bold leading-tight text-card-foreground">
              {homeTeam}
            </span>
            <span
              className="text-xs text-muted-foreground"
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
          <span className="text-card-foreground">
            Sec {section} · Row {row} · Seat {seat}
          </span>
          {(gate || time) && (
            <div className="flex items-center justify-between tabular-nums text-muted-foreground">
              {gate && <span>Gate {gate}</span>}
              {time && <span>{time}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
