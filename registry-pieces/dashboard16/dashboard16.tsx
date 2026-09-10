"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type DayStatus = "up" | "degraded" | "outage" | "none";

interface Dashboard16Props {
  service?: string;
  uptime?: string;
  days?: DayStatus[];
  startLabel?: string;
  endLabel?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const statusClasses: Record<DayStatus, string> = {
  up: "bg-emerald-500",
  degraded: "bg-amber-500",
  outage: "bg-rose-500",
  none: "bg-current/10",
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


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const dashboard16Demo: Dashboard16Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard16Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-80 flex-col gap-3 rounded-md p-4 shadow-sm",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate font-mono text-xs font-medium">
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
        <div className="flex items-center justify-between text-xs text-current/60">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      </div>
    </div>
  );
}
