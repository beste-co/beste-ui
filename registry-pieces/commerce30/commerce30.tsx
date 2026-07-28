"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface Commerce30Region {
  flag: string;
  country: string;
  currency: string;
  symbol: string;
}

interface Commerce30Props {
  selected?: string;
  regions?: Commerce30Region[];
  className?: string;
}

export const commerce30Demo: Commerce30Props = {
  selected: "United Kingdom",
  regions: [
    { flag: "🇺🇸", country: "United States", currency: "USD", symbol: "$" },
    { flag: "🇬🇧", country: "United Kingdom", currency: "GBP", symbol: "£" },
    { flag: "🇪🇺", country: "Eurozone", currency: "EUR", symbol: "€" },
    { flag: "🇯🇵", country: "Japan", currency: "JPY", symbol: "¥" },
  ],
};

export function Commerce30({
  selected,
  regions = [],
  className,
}: Commerce30Props) {
  const active = regions.find((r) => r.country === selected);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <Globe
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            {active ? (
              <span className="flex items-center gap-1.5 text-xs">
                <span aria-hidden="true">{active.flag}</span>
                <span className="font-medium text-card-foreground">
                  {active.country}
                </span>
                <span className="font-mono text-muted-foreground">
                  · {active.currency} {active.symbol}
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Select region
              </span>
            )}
          </div>
          <ChevronDown
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <ul className="flex flex-col">
          {regions.map((r) => {
            const isActive = r.country === selected;
            return (
              <li key={r.country}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left transition-colors hover:bg-muted",
                    isActive && "bg-muted"
                  )}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span aria-hidden="true">{r.flag}</span>
                    <span className="text-card-foreground">{r.country}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                    <span>{r.currency}</span>
                    <span>{r.symbol}</span>
                    {isActive && (
                      <Check
                        className="size-3 text-card-foreground"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
