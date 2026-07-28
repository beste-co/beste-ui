"use client";

import { Clock, MapPin, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

interface Travel18Props {
  title?: string;
  city?: string;
  duration?: string;
  ratingLine?: string;
  price?: string;
  badge?: string;
  className?: string;
}

export const travel18Demo: Travel18Props = {
  title: "Vatican Museums & Sistine Chapel",
  city: "Rome",
  duration: "3 hours · Small group",
  ratingLine: "★ 4.9 · 12,340 reviews",
  price: "€54",
  badge: "Skip the line",
};

export function Travel18({
  title,
  city,
  duration,
  ratingLine,
  price,
  badge,
  className,
}: Travel18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col">
            {badge && (
              <span className="mb-1 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <Ticket className="size-3" aria-hidden="true" />
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
              <span className="font-mono text-base font-bold text-card-foreground">
                {price}
              </span>
              <span className="text-xs text-muted-foreground">per person</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {city && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" aria-hidden="true" />
              {city}
            </span>
          )}
          {duration && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden="true" />
              {duration}
            </span>
          )}
        </div>
        {ratingLine && (
          <span className="text-xs text-amber-600 dark:text-amber-400">
            {ratingLine}
          </span>
        )}
      </div>
    </div>
  );
}
