"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input16Props {
  hours?: string;
  minutes?: string;
  meridiem?: "AM" | "PM";
  className?: string;
}

export const input16Demo: Input16Props = {
  hours: "09",
  minutes: "30",
  meridiem: "AM",
};

export function Input16({
  hours = "00",
  minutes = "00",
  meridiem,
  className,
}: Input16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1 shadow-sm">
        <Clock
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <div className="flex items-center gap-0.5 font-mono text-lg">
          <span className="flex size-9 items-center justify-center rounded-sm bg-muted font-semibold text-card-foreground">
            {hours}
          </span>
          <span className="text-muted-foreground">:</span>
          <span className="flex size-9 items-center justify-center rounded-sm bg-muted font-semibold text-card-foreground">
            {minutes}
          </span>
        </div>
        {meridiem && (
          <div className="flex items-center rounded-md bg-muted p-0.5">
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-xs font-semibold",
                meridiem === "AM"
                  ? "bg-card text-card-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              AM
            </span>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-xs font-semibold",
                meridiem === "PM"
                  ? "bg-card text-card-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              PM
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
