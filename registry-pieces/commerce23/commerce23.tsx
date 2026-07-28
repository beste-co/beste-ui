"use client";

import { cn } from "@/lib/utils";

interface Commerce23Row {
  label: string;
  value: string;
  muted?: boolean;
  emphasis?: boolean;
}

interface Commerce23Props {
  rows?: Commerce23Row[];
  total?: string;
  totalLabel?: string;
  className?: string;
}

export const commerce23Demo: Commerce23Props = {
  rows: [
    { label: "Subtotal", value: "$284.00" },
    { label: "Shipping", value: "Free", muted: true },
    { label: "Tax (8.5%)", value: "$24.14" },
    { label: "Discount · SUMMER20", value: "−$56.80", emphasis: true },
  ],
  total: "$251.34",
  totalLabel: "Total",
};

export function Commerce23({
  rows = [],
  total = "$0.00",
  totalLabel = "Total",
  className,
}: Commerce23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex flex-col gap-1">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-baseline justify-between gap-2 text-xs"
            >
              <span className="truncate text-muted-foreground">{r.label}</span>
              <span
                className={cn(
                  "shrink-0 font-mono tabular-nums",
                  r.emphasis
                    ? "font-medium text-emerald-600 dark:text-emerald-400"
                    : r.muted
                      ? "text-muted-foreground"
                      : "text-card-foreground"
                )}
              >
                {r.value}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-2 border-t border-border pt-2">
          <span className="text-sm font-semibold text-card-foreground">
            {totalLabel}
          </span>
          <span className="font-mono text-lg font-semibold tabular-nums text-card-foreground">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}
