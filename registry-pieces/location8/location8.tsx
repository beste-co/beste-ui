"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteRow {
  name: string;
  meta: string;
  value: string;
}

interface Location8Props {
  title?: string;
  region?: string;
  sites?: SiteRow[];
  total?: string;
  totalLabel?: string;
  className?: string;
}

export const location8Demo: Location8Props = {
  title: "Sites on this plan",
  region: "United Kingdom",
  sites: [
    { name: "Bramble Health", meta: "Bristol", value: "6 rooms" },
    { name: "Kingsway Clinic", meta: "Leeds", value: "4 rooms" },
    { name: "Harbour Practice", meta: "Southampton", value: "3 rooms" },
  ],
  total: "13",
  totalLabel: "rooms live across three sites",
};

export function Location8({
  title,
  region,
  sites = [],
  total,
  totalLabel,
  className,
}: Location8Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-96 rounded-md border border-border bg-card p-5 shadow-xl">
        <div className="flex items-baseline justify-between gap-3">
          {title && <p className="text-sm font-semibold text-card-foreground">{title}</p>}
          {region && <span className="text-xs text-muted-foreground">{region}</span>}
        </div>

        <div className="mt-3 flex flex-col gap-2.5">
          {sites.map((site, index) => (
            <div key={index} className="flex items-center gap-3">
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <MapPin className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-card-foreground">{site.name}</p>
                <p className="truncate text-xs text-muted-foreground">{site.meta}</p>
              </div>
              <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                {site.value}
              </span>
            </div>
          ))}
        </div>

        {(total || totalLabel) && (
          <div className="mt-4 flex items-baseline gap-2 border-t border-border pt-3">
            {total && (
              <span className="text-2xl font-light tracking-tight tabular-nums text-card-foreground">
                {total}
              </span>
            )}
            {totalLabel && <span className="text-sm text-muted-foreground">{totalLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
