"use client";

import { cn } from "@/lib/utils";

interface Travel28Props {
  title?: string;
  distance?: string;
  eta?: string;
  note?: string;
  className?: string;
}

export const travel28Demo: Travel28Props = {
  title: "Hotel Alma Soho",
  distance: "1.8 km away",
  eta: "24 min",
  note: "On foot · fastest route",
};

export function Travel28({
  title,
  distance,
  eta,
  note,
  className,
}: Travel28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {title && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {title}
              </span>
            )}
            {distance && (
              <span className="text-sm text-muted-foreground">
                {distance}
              </span>
            )}
          </div>
          {eta && (
            <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {eta}
            </span>
          )}
        </div>
        {note && (
          <span className="border-t border-border pt-2 text-sm text-muted-foreground">
            {note}
          </span>
        )}
      </div>
    </div>
  );
}
