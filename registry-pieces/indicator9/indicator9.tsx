"use client";

import { cn } from "@/lib/utils";

type Freshness = "live" | "recent" | "stale";

interface Indicator9Props {
  label?: string;
  when?: string;
  freshness?: Freshness;
  className?: string;
}

const freshnessConfig: Record<
  Freshness,
  { dot: string; ring: string; text: string; animate: boolean }
> = {
  live: {
    dot: "bg-emerald-500",
    ring: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
    animate: true,
  },
  recent: {
    dot: "bg-sky-500",
    ring: "bg-sky-500",
    text: "text-muted-foreground",
    animate: false,
  },
  stale: {
    dot: "bg-amber-500",
    ring: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-300",
    animate: false,
  },
};

export const indicator9Demo: Indicator9Props = {
  label: "Updated",
  when: "3 seconds ago",
  freshness: "live",
};

export function Indicator9({
  label = "Updated",
  when,
  freshness = "live",
  className,
}: Indicator9Props) {
  const config = freshnessConfig[freshness];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-2">
        <span className="relative flex size-2 items-center justify-center">
          {config.animate && (
            <span
              className={cn(
                "absolute inline-flex size-full animate-ping rounded-full opacity-75",
                config.ring
              )}
              aria-hidden="true"
            />
          )}
          <span
            className={cn("relative size-2 rounded-full", config.dot)}
            aria-hidden="true"
          />
        </span>
        <span className={cn("text-xs font-medium", config.text)}>
          {label} {when}
        </span>
      </div>
    </div>
  );
}
