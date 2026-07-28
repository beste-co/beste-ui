"use client";

import { cn } from "@/lib/utils";

type Stock = "in" | "low" | "out" | "preorder";

interface Indicator12Props {
  stock?: Stock;
  count?: number;
  preorderDate?: string;
  className?: string;
}

const stockConfig: Record<
  Stock,
  { dot: string; text: string; label: (count?: number) => string }
> = {
  in: {
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
    label: (count) =>
      typeof count === "number" ? `In stock · ${count} available` : "In stock",
  },
  low: {
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-300",
    label: (count) =>
      typeof count === "number" ? `Only ${count} left` : "Low stock",
  },
  out: {
    dot: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-300",
    label: () => "Out of stock",
  },
  preorder: {
    dot: "bg-sky-500",
    text: "text-sky-700 dark:text-sky-300",
    label: () => "Preorder",
  },
};

export const indicator12Demo: Indicator12Props = {
  stock: "low",
  count: 4,
};

export function Indicator12({
  stock = "in",
  count,
  preorderDate,
  className,
}: Indicator12Props) {
  const config = stockConfig[stock];
  const label = config.label(count);
  const trailing = stock === "preorder" && preorderDate;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-2">
        <span
          className={cn("size-2 shrink-0 rounded-full", config.dot)}
          aria-hidden="true"
        />
        <span className={cn("text-sm font-semibold", config.text)}>
          {label}
        </span>
        {trailing && (
          <>
            <span
              className="h-3 w-px bg-border"
              aria-hidden="true"
            />
            <span className="text-xs text-muted-foreground">
              Ships {preorderDate}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
