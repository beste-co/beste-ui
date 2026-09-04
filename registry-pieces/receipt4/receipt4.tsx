"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LineItem {
  label: string;
  amount: number;
}

interface Receipt4Props {
  store?: string;
  reference?: string;
  items?: LineItem[];
  taxRate?: number;
  printMs?: number;
  className?: string;
}

export const receipt4Demo: Receipt4Props = {
  store: "Beste Records",
  reference: "Order 4821",
  items: [
    { label: "Blue Note Vinyl", amount: 34 },
    { label: "Tote Bag", amount: 18 },
    { label: "Espresso", amount: 4.5 },
  ],
  taxRate: 0.08,
};

function money(value: number): string {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function Receipt4({
  store = "Store",
  reference = "Receipt",
  items = [],
  taxRate = 0,
  printMs = 1400,
  className,
}: Receipt4Props) {
  const [printed, setPrinted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setPrinted(true), printMs + 200);
    return () => clearTimeout(id);
  }, [printMs]);

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + tax;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes receipt4-print { from { transform: translateY(-100%); } to { transform: translateY(0); } }`}</style>
      <div className="flex w-full max-w-64 flex-col items-center">
        <span
          className="relative z-10 h-1.5 w-full rounded-full bg-border"
          aria-hidden="true"
        />
        <div className="w-full overflow-hidden px-2">
          <div
            className="motion-reduce:animate-none"
            style={{ animation: `receipt4-print ${printMs}ms ease-out both` }}
          >
            <div className="border border-b-0 border-border bg-card px-4 pb-1 pt-4 shadow-md">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-sm font-semibold text-card-foreground">
                  {store}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {reference}
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-1.5 border-t border-dashed border-border pt-3">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span className="truncate text-sm text-card-foreground">
                      {item.label}
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-card-foreground">
                      {money(item.amount)}
                    </span>
                  </div>
                ))}
                {taxRate > 0 && (
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm text-muted-foreground">Tax</span>
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {money(tax)}
                    </span>
                  </div>
                )}
              </div>

              <div
                className={cn(
                  "-mx-2 mt-2 flex items-baseline justify-between gap-3 rounded-md px-2 py-1.5 transition-colors duration-500 motion-reduce:transition-none",
                  printed ? "bg-emerald-500/10" : "bg-transparent"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-500",
                    printed
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-card-foreground"
                  )}
                >
                  Total
                </span>
                <span
                  className={cn(
                    "text-base font-semibold tabular-nums transition-colors duration-500",
                    printed
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-card-foreground"
                  )}
                >
                  {money(total)}
                </span>
              </div>
            </div>
            <div
              className="flex h-1.5 justify-center gap-1 overflow-hidden"
              aria-hidden="true"
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="size-2 shrink-0 -translate-y-1 rotate-45 border border-border bg-card"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
