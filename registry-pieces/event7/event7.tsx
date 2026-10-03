"use client";

import { cn } from "@/lib/utils";

interface Tier {
  name: string;
  price: string;
  remaining?: number;
  highlighted?: boolean;
  soldOut?: boolean;
}

interface Event7Props {
  heading?: string;
  tiers?: Tier[];
  bordered?: boolean;
  className?: string;
}

export const event7Demo: Event7Props = {
  heading: "Conference passes",
  tiers: [
    { name: "Early bird", price: "$249", highlighted: true },
    { name: "Standard", price: "$399" },
    { name: "VIP", price: "$1,200", soldOut: true },
  ],
  bordered: false,
};

export function Event7({
  heading,
  tiers = [],
  bordered = false,
  className,
}: Event7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-1 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {heading && (
          <span className="text-xs font-semibold text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="flex flex-col divide-y divide-border">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center justify-between gap-2 py-1.5",
                t.soldOut && "opacity-60"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm",
                    t.highlighted
                      ? "font-semibold text-primary"
                      : "font-medium text-card-foreground"
                  )}
                >
                  {t.name}
                </span>
                {t.remaining !== undefined && !t.soldOut && (
                  <span className="text-xs text-muted-foreground">
                    · {t.remaining} left
                  </span>
                )}
                {t.soldOut && (
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    · Sold out
                  </span>
                )}
              </div>
              <span className="text-sm font-bold tabular-nums text-card-foreground">
                {t.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
