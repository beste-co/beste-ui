"use client";

import { cn } from "@/lib/utils";

type Status = "up" | "degraded" | "down";

interface Dashboard25Service {
  name: string;
  status: Status;
  uptime: string;
}

interface Dashboard25Props {
  heading?: string;
  upLabel?: string;
  degradedLabel?: string;
  downLabel?: string;
  services?: Dashboard25Service[];
  className?: string;
}

const DOT: Record<Status, string> = {
  up: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-rose-500",
};

export const dashboard25Demo: Dashboard25Props = {
  heading: "Services",
  upLabel: "Operational",
  degradedLabel: "Degraded",
  downLabel: "Outage",
  services: [
    { name: "API", status: "up", uptime: "99.99%" },
    { name: "Ingest", status: "degraded", uptime: "99.82%" },
    { name: "Billing", status: "up", uptime: "99.97%" },
    { name: "Workers", status: "up", uptime: "99.95%" },
  ],
};

export function Dashboard25({
  heading = "Services",
  upLabel = "Operational",
  degradedLabel = "Degraded",
  downLabel = "Outage",
  services = [],
  className,
}: Dashboard25Props) {
  const labels: Record<Status, string> = {
    up: upLabel,
    degraded: degradedLabel,
    down: downLabel,
  };
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-md border border-border bg-card p-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {heading}
        </span>
        <ul className="flex flex-col divide-y divide-border">
          {services.map((s) => (
            <li
              key={s.name}
              className="flex items-center justify-between gap-2 py-1.5"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="relative flex size-2" aria-hidden="true">
                  {s.status !== "down" && (
                    <span
                      className={cn(
                        "absolute inset-0 animate-ping rounded-full opacity-60",
                        DOT[s.status]
                      )}
                    />
                  )}
                  <span
                    className={cn("relative size-2 rounded-full", DOT[s.status])}
                  />
                </span>
                <span className="truncate text-xs font-medium text-card-foreground">
                  {s.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {labels[s.status]}
                </span>
              </div>
              <span className="shrink-0 font-mono text-xs tabular-nums text-card-foreground">
                {s.uptime}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
