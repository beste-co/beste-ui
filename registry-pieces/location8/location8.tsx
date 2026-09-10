"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


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

export const location8Demo: Location8Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Location8Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-96 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between gap-3">
          {title && <p className="text-sm font-semibold">{title}</p>}
          {region && <span className="text-xs text-current/60">{region}</span>}
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
                <p className="truncate text-sm">{site.name}</p>
                <p className="truncate text-xs text-current/60">{site.meta}</p>
              </div>
              <span className="shrink-0 text-sm tabular-nums text-current/60">
                {site.value}
              </span>
            </div>
          ))}
        </div>

        {(total || totalLabel) && (
          <div className="mt-4 flex items-baseline gap-2 border-t border-current/15 pt-3">
            {total && (
              <span className="text-2xl font-light tracking-tight tabular-nums">
                {total}
              </span>
            )}
            {totalLabel && <span className="text-sm text-current/60">{totalLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
