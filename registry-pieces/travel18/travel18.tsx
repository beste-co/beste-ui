"use client";

import { cn } from "@/lib/utils";

interface Travel18Props {
  title?: string;
  city?: string;
  duration?: string;
  ratingLine?: string;
  price?: string;
  badge?: string;
  bordered?: boolean;
  className?: string;
}

export const travel18Demo: Travel18Props = {
  title: "Vatican Museums & Sistine Chapel",
  city: "Rome",
  duration: "3 hours",
  price: "€54",
  badge: "Skip the line",
  bordered: false,
};

export function Travel18({
  title,
  city,
  duration,
  ratingLine,
  price,
  badge,
  bordered = false,
  className,
}: Travel18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col">
            {badge && (
              <span className="mb-1 inline-flex w-fit items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                {badge}
              </span>
            )}
            {title && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {title}
              </span>
            )}
          </div>
          {price && (
            <div className="flex shrink-0 flex-col items-end">
              <span className="text-base font-bold tabular-nums text-card-foreground">
                {price}
              </span>
              <span className="text-xs text-muted-foreground">per person</span>
            </div>
          )}
        </div>
        {(city || duration) && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {city && <span>{city}</span>}
            {duration && <span>{duration}</span>}
          </div>
        )}
        {ratingLine && (
          <span className="text-xs text-amber-600 dark:text-amber-400">
            {ratingLine}
          </span>
        )}
      </div>
    </div>
  );
}
