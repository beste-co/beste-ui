"use client";

import { cn } from "@/lib/utils";

type ServiceStatus = "operational" | "degraded" | "outage" | "maintenance";

interface Monitoring1Props {
  service?: string;
  status?: ServiceStatus;
  uptime?: string;
  operationalLabel?: string;
  degradedLabel?: string;
  outageLabel?: string;
  maintenanceLabel?: string;
  className?: string;
}

const statusStyles: Record<
  ServiceStatus,
  { dot: string; ring: string; text: string }
> = {
  operational: {
    dot: "bg-emerald-500",
    ring: "bg-emerald-500/30",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  degraded: {
    dot: "bg-amber-500",
    ring: "bg-amber-500/30",
    text: "text-amber-700 dark:text-amber-400",
  },
  outage: {
    dot: "bg-rose-500",
    ring: "bg-rose-500/30",
    text: "text-rose-700 dark:text-rose-400",
  },
  maintenance: {
    dot: "bg-sky-500",
    ring: "bg-sky-500/30",
    text: "text-sky-700 dark:text-sky-400",
  },
};

export const monitoring1Demo: Monitoring1Props = {
  service: "API Gateway",
  status: "operational",
  uptime: "99.98%",
  operationalLabel: "Operational",
  degradedLabel: "Degraded",
  outageLabel: "Outage",
  maintenanceLabel: "Maintenance",
};

export function Monitoring1({
  service = "Service",
  status = "operational",
  uptime,
  operationalLabel = "Operational",
  degradedLabel = "Degraded",
  outageLabel = "Outage",
  maintenanceLabel = "Maintenance",
  className,
}: Monitoring1Props) {
  const styles = statusStyles[status];
  const statusLabel: Record<ServiceStatus, string> = {
    operational: operationalLabel,
    degraded: degradedLabel,
    outage: outageLabel,
    maintenance: maintenanceLabel,
  };

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex min-w-0 items-center gap-2">
          <span className="relative flex size-2 items-center justify-center">
            <span
              className={cn(
                "absolute inline-flex size-full animate-ping rounded-full opacity-75",
                styles.ring
              )}
              aria-hidden="true"
            />
            <span
              className={cn("relative size-2 rounded-full", styles.dot)}
              aria-hidden="true"
            />
          </span>
          <span className="truncate text-sm font-medium text-card-foreground">
            {service}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={cn("text-xs font-semibold", styles.text)}>
            {statusLabel[status]}
          </span>
          {uptime && (
            <span className="text-xs tabular-nums text-muted-foreground">
              {uptime}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
