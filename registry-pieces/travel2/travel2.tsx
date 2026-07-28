"use client";

import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface Travel2Props {
  passenger?: string;
  flight?: string;
  from?: string;
  to?: string;
  seat?: string;
  gate?: string;
  boardingTime?: string;
  headerLabel?: string;
  passengerLabel?: string;
  gateLabel?: string;
  boardingLabel?: string;
  seatLabel?: string;
  className?: string;
}

export const travel2Demo: Travel2Props = {
  passenger: "Beste Sözen",
  flight: "TK 1983",
  from: "IST",
  to: "LHR",
  seat: "12A",
  gate: "B22",
  boardingTime: "09:10",
  headerLabel: "Boarding pass",
  passengerLabel: "Passenger",
  gateLabel: "Gate",
  boardingLabel: "Boarding",
  seatLabel: "Seat",
};

export function Travel2({
  passenger,
  flight,
  from,
  to,
  seat,
  gate,
  boardingTime,
  headerLabel = "Boarding pass",
  passengerLabel = "Passenger",
  gateLabel = "Gate",
  boardingLabel = "Boarding",
  seatLabel = "Seat",
  className,
}: Travel2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative flex w-full max-w-80 overflow-hidden rounded-xl bg-card border border-dashed shadow-md ring-1 ring-border">
        <span
          className="absolute left-0 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background"
          aria-hidden="true"
        />
        <span
          className="absolute right-0 top-1/2 size-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-background"
          aria-hidden="true"
        />
        <div className="flex-1 p-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>{headerLabel}</span>
            <span>{flight}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-mono text-2xl font-bold text-card-foreground">
              {from}
            </span>
            <Plane
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="font-mono text-2xl font-bold text-card-foreground">
              {to}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1 text-xs">
            <div className="flex flex-col">
              <span className="text-muted-foreground">{passengerLabel}</span>
              <span className="truncate font-semibold text-card-foreground">
                {passenger}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">{gateLabel}</span>
              <span className="font-mono font-semibold text-card-foreground">
                {gate}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">{boardingLabel}</span>
              <span className="font-mono font-semibold text-card-foreground">
                {boardingTime}
              </span>
            </div>
          </div>
        </div>
        <div
          className="flex items-center border-l border-dashed border-border bg-muted/50 px-4"
          aria-hidden="false"
        >
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {seatLabel}
            </span>
            <span className="font-mono text-xl font-bold text-card-foreground">
              {seat}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
