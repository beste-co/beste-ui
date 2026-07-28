"use client";

import { ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Stock = "in" | "low" | "out";

interface Commerce28Store {
  name: string;
  distance: string;
  stock: Stock;
}

interface Commerce28Props {
  stores?: Commerce28Store[];
  className?: string;
}

const STOCK: Record<
  Stock,
  { dot: string; label: string; color: string }
> = {
  in: {
    dot: "bg-emerald-500",
    label: "In stock",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  low: {
    dot: "bg-amber-500",
    label: "Low stock",
    color: "text-amber-600 dark:text-amber-400",
  },
  out: {
    dot: "bg-rose-500",
    label: "Out of stock",
    color: "text-rose-600 dark:text-rose-400",
  },
};

export const commerce28Demo: Commerce28Props = {
  stores: [
    { name: "SF Union Square", distance: "0.4 mi", stock: "in" },
    { name: "Hayes Valley", distance: "1.2 mi", stock: "low" },
    { name: "Mission District", distance: "2.8 mi", stock: "out" },
  ],
};

export function Commerce28({ stores = [], className }: Commerce28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-1.5 pb-1">
          <MapPin
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Find in store
          </span>
        </div>
        <ul className="flex flex-col divide-y divide-border">
          {stores.map((s) => {
            const cfg = STOCK[s.stock];
            return (
              <li
                key={s.name}
                className="flex items-center justify-between gap-2 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn("size-2 shrink-0 rounded-full", cfg.dot)}
                    aria-hidden="true"
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-xs font-medium text-card-foreground">
                      {s.name}
                    </span>
                    <span className={cn("text-xs", cfg.color)}>
                      {cfg.label} · {s.distance}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
