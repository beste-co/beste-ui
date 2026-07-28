"use client";

import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input21Props {
  label?: string;
  hours?: number;
  minutes?: number;
  className?: string;
}

export const input21Demo: Input21Props = {
  label: "Session length",
  hours: 1,
  minutes: 45,
};

export function Input21({
  label,
  hours = 0,
  minutes = 0,
  className,
}: Input21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 shadow-sm">
          <Timer
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="flex flex-1 items-baseline justify-center gap-1">
            <span className="font-mono text-lg font-bold text-card-foreground">
              {hours}
            </span>
            <span className="text-xs text-muted-foreground">h</span>
            <span className="font-mono text-lg font-bold text-card-foreground">
              {minutes.toString().padStart(2, "0")}
            </span>
            <span className="text-xs text-muted-foreground">m</span>
          </div>
          <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
            HH:MM
          </span>
        </div>
      </div>
    </div>
  );
}
