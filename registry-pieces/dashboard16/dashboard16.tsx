"use client";

import { cn } from "@/lib/utils";

type DayStatus = "up" | "degraded" | "outage" | "none";

interface Dashboard16Props {
  service?: string;
  uptime?: string;
  days?: DayStatus[];
  startLabel?: string;
  endLabel?: string;
  className?: string;
}

const statusClasses: Record<DayStatus, string> = {
  up: "bg-emerald-500",
  degraded: "bg-amber-500",
  outage: "bg-rose-500",
  none: "bg-muted",
};

const buildDemoDays = (): DayStatus[] => {
  const out: DayStatus[] = [];
  for (let i = 0; i < 60; i++) {
    if (i === 14) out.push("outage");
    else if (i === 31 || i === 32) out.push("degraded");
    else if (i === 48) out.push("degraded");
    else out.push("up");
  }
  return out;
};

export const dashboard16Demo: Dashboard16Props = {
  service: "api.prod.example",
  uptime: "99.94%",
  days: buildDemoDays(),
  startLabel: "60 days ago",
  endLabel: "Today",
};

export function Dashboard16({
  service = "Service",
  uptime,
  days = [],
  startLabel = "60 days ago",
  endLabel = "Today",
  className,
}: Dashboard16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-md border border-border bg-card p-4 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate font-mono text-xs font-medium text-card-foreground">
            {service}
          </span>
          {uptime && (
            <span className="font-mono text-xs font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
              {uptime}
            </span>
          )}
        </div>
        <div className="flex h-8 items-stretch gap-px">
          {days.map((status, i) => (
            <span
              key={i}
              className={cn(
                "flex-1 rounded-sm",
                statusClasses[status]
              )}
              aria-hidden="true"
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      </div>
    </div>
  );
}
