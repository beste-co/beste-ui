"use client";

import { useEffect, useState } from "react";
import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface Boarding2Props {
  airline?: string;
  flight?: string;
  from?: string;
  to?: string;
  gate?: string;
  seat?: string;
  group?: string;
  boardingSeconds?: number;
  flightMs?: number;
  className?: string;
}

export const boarding2Demo: Boarding2Props = {
  airline: "Northline Air",
  flight: "NL 412",
  from: "LIS",
  to: "BER",
  gate: "B14",
  seat: "12A",
  group: "Group 2",
  boardingSeconds: 1458,
};

function format(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function Boarding2({
  airline = "Airline",
  flight = "XX 000",
  from = "AAA",
  to = "BBB",
  gate = "A1",
  seat = "1A",
  group = "Group 1",
  boardingSeconds = 900,
  flightMs = 6000,
  className,
}: Boarding2Props) {
  const [left, setLeft] = useState(boardingSeconds);

  useEffect(() => {
    setLeft(boardingSeconds);
    const id = setInterval(() => {
      setLeft((v) => (v <= 1 ? boardingSeconds : v - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [boardingSeconds]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes boarding2-fly { 0% { left: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
@keyframes boarding2-trail { 0% { width: 0%; opacity: 1; } 90% { opacity: 1; } 100% { width: 100%; opacity: 0; } }
`}</style>

      <div className="flex w-full max-w-72 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-card-foreground">
              {airline}
            </p>
            <p className="font-mono text-xs text-muted-foreground">{flight}</p>
          </div>
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium tabular-nums text-amber-600 dark:text-amber-400">
            Boards in {format(left)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold tracking-wide text-card-foreground">
            {from}
          </span>
          <span className="relative h-6 flex-1" aria-hidden="true">
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-border" />
            <span
              className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-foreground"
              style={{ animation: `boarding2-trail ${flightMs}ms linear infinite` }}
            />
            <Plane
              className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rotate-45 text-foreground"
              style={{ animation: `boarding2-fly ${flightMs}ms linear infinite` }}
            />
          </span>
          <span className="text-xl font-semibold tracking-wide text-card-foreground">
            {to}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-dashed border-border pt-3 text-xs">
          {[
            { label: "Gate", value: gate },
            { label: "Seat", value: seat },
            { label: "Boarding", value: group },
          ].map((cell) => (
            <div key={cell.label} className="text-center">
              <p className="text-muted-foreground">{cell.label}</p>
              <p className="font-medium text-card-foreground">{cell.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
