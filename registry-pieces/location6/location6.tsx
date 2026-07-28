"use client";

import { cn } from "@/lib/utils";

type Status = "open" | "closed" | "closing-soon";

interface Location6Props {
  name?: string;
  category?: string;
  rating?: number;
  reviewCount?: string;
  status?: Status;
  hours?: string;
  className?: string;
}

const statusClasses: Record<Status, string> = {
  open: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  closed: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  "closing-soon": "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

const statusLabel: Record<Status, string> = {
  open: "Open",
  closed: "Closed",
  "closing-soon": "Closing soon",
};

export const location6Demo: Location6Props = {
  name: "Joe's Coffee",
  category: "Café",
  rating: 4.7,
  reviewCount: "1.2k",
  status: "open",
  hours: "Closes 9:00 PM",
};

export function Location6({
  name,
  category,
  rating,
  reviewCount,
  status = "open",
  hours,
  className,
}: Location6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-1 rounded-lg border border-border bg-card p-3 shadow-sm">
        {name && (
          <span className="text-base font-bold leading-tight text-card-foreground">
            {name}
          </span>
        )}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {rating !== undefined && (
            <span className="flex items-center gap-1">
              <span className="text-amber-500" aria-hidden="true">
                ★
              </span>
              <span className="font-semibold text-card-foreground">
                {rating.toFixed(1)}
              </span>
              {reviewCount && <span>({reviewCount})</span>}
            </span>
          )}
          {category && (
            <>
              <span
                className="size-1 rounded-full bg-muted-foreground/40"
                aria-hidden="true"
              />
              <span>{category}</span>
            </>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-semibold",
              statusClasses[status]
            )}
          >
            {statusLabel[status]}
          </span>
          {hours && <span className="text-muted-foreground">{hours}</span>}
        </div>
      </div>
    </div>
  );
}
