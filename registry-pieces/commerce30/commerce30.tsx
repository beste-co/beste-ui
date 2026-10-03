"use client";

import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Commerce30Region {
  flag: string;
  country: string;
  currency: string;
  symbol?: string;
}

interface Commerce30Props {
  selected?: string;
  regions?: Commerce30Region[];
  bordered?: boolean;
  className?: string;
}

export const commerce30Demo: Commerce30Props = {
  selected: "United Kingdom",
  regions: [
    { flag: "🇺🇸", country: "United States", currency: "USD" },
    { flag: "🇬🇧", country: "United Kingdom", currency: "GBP" },
    { flag: "🇪🇺", country: "Eurozone", currency: "EUR" },
    { flag: "🇯🇵", country: "Japan", currency: "JPY" },
  ],
  bordered: false,
};

export function Commerce30({
  selected,
  regions = [],
  bordered = false,
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
      <div className={cn("flex w-full max-w-72 flex-col overflow-hidden rounded-md bg-card shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
          {active ? (
            <span className="flex items-center gap-1.5 text-xs">
              <span aria-hidden="true">{active.flag}</span>
              <span className="font-medium text-card-foreground">
                {active.country}
              </span>
              <span className="text-muted-foreground">
                · {active.currency}
                {active.symbol ? ` ${active.symbol}` : ""}
              </span>
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Select region</span>
          )}
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
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{r.currency}</span>
                    {r.symbol && <span>{r.symbol}</span>}
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
