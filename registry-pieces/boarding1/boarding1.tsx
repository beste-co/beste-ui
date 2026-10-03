"use client";

import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface Boarding1Props {
  from?: string;
  to?: string;
  date?: string;
  flight?: string;
  seat?: string;
  bordered?: boolean;
  className?: string;
}

export const boarding1Demo: Boarding1Props = {
  from: "IST",
  to: "LHR",
  date: "Jun 14",
  seat: "12A",
  bordered: false,
};

export function Boarding1({
  from = "LAX",
  to = "JFK",
  date,
  flight,
  seat,
  bordered = false,
  className,
}: Boarding1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-2 rounded-lg bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-3xl font-bold leading-none tabular-nums text-card-foreground">
            {from}
          </span>
          <div className="flex flex-1 items-center gap-1.5 px-2" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
            <span className="h-px flex-1 bg-muted-foreground/40" />
            <Plane className="size-4 -rotate-45 text-muted-foreground" />
            <span className="h-px flex-1 bg-muted-foreground/40" />
            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
          </div>
          <span className="text-3xl font-bold leading-none tabular-nums text-card-foreground">
            {to}
          </span>
        </div>
        {(flight || date || seat) && (
          <div className="flex items-center justify-between border-t border-dashed border-border pt-2 text-xs">
            {flight && (
              <div className="flex flex-col">
                <span className="text-muted-foreground">Flight</span>
                <span className="font-semibold text-card-foreground">
                  {flight}
                </span>
              </div>
            )}
            {date && (
              <div className="flex flex-col">
                <span className="text-muted-foreground">Date</span>
                <span className="font-semibold text-card-foreground">{date}</span>
              </div>
            )}
            {seat && (
              <div className="flex flex-col items-end">
                <span className="text-muted-foreground">Seat</span>
                <span className="font-semibold text-card-foreground">
                  {seat}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
