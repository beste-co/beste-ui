"use client";

import { cn } from "@/lib/utils";

type RegionStatus = "operational" | "degraded" | "outage";

interface Region {
  code: string;
  status: RegionStatus;
  latency?: string;
}

interface Monitoring7Props {
  regions?: Region[];
  bordered?: boolean;
  className?: string;
}

const dotClasses: Record<RegionStatus, string> = {
  operational: "bg-emerald-500",
  degraded: "bg-amber-500",
  outage: "bg-rose-500",
};

const defaultRegions: Region[] = [
  { code: "us-east-1", status: "operational", latency: "42ms" },
  { code: "eu-west-2", status: "operational", latency: "78ms" },
  { code: "ap-south-1", status: "degraded", latency: "210ms" },
  { code: "sa-east-1", status: "outage" },
];

export const monitoring7Demo: Monitoring7Props = {
  regions: defaultRegions,
  bordered: false,
};

export function Monitoring7({
  regions = defaultRegions,
  bordered = false,
  className,
}: Monitoring7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col gap-1 rounded-lg bg-card px-3 py-2.5 shadow-sm", bordered && "border border-border")}>
        {regions.map((region) => (
          <div
            key={region.code}
            className="flex items-center justify-between gap-3 py-1"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  dotClasses[region.status]
                )}
                aria-hidden="true"
              />
              <span className="truncate text-xs text-card-foreground">
                {region.code}
              </span>
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {region.latency ?? "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
