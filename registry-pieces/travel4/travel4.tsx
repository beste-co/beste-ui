"use client";

import { cn } from "@/lib/utils";

type FlightStatus = "on-time" | "delayed" | "boarding" | "cancelled";

interface Travel4Props {
  flight?: string;
  route?: string;
  status?: FlightStatus;
  gate?: string;
  updated?: string;
  className?: string;
}

const statusConfig: Record<
  FlightStatus,
  { label: string; pill: string; dot: string }
> = {
  "on-time": {
    label: "On time",
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  delayed: {
    label: "Delayed 40m",
    pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  boarding: {
    label: "Boarding now",
    pill: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  cancelled: {
    label: "Cancelled",
    pill: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

export const travel4Demo: Travel4Props = {
  flight: "PC 1142",
  route: "SAW → AMS",
  status: "boarding",
  gate: "Gate 34 · closing in 8 min",
  updated: "Updated 1 min ago",
};

export function Travel4({
  flight,
  route,
  status = "on-time",
  gate,
  updated,
  className,
}: Travel4Props) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-sm font-semibold text-card-foreground">
              {flight}
            </span>
            <span className="text-xs text-muted-foreground">{route}</span>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold",
              config.pill
            )}
          >
            <span
              className={cn("size-1.5 rounded-full", config.dot)}
              aria-hidden="true"
            />
            {config.label}
          </span>
        </div>
        {gate && (
          <span className="text-sm text-card-foreground">{gate}</span>
        )}
        {updated && (
          <span className="text-xs text-muted-foreground">{updated}</span>
        )}
      </div>
    </div>
  );
}
