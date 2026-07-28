"use client";

import { cn } from "@/lib/utils";

interface Option {
  label: string;
  description: string;
}

interface Form23Props {
  legend?: string;
  options?: Option[];
  selectedIndex?: number;
  className?: string;
}

export const form23Demo: Form23Props = {
  legend: "Delivery speed",
  options: [
    {
      label: "Standard",
      description: "3–5 business days · Free",
    },
    {
      label: "Express",
      description: "Next business day · $8",
    },
    {
      label: "Same-day",
      description: "Order by noon · $14",
    },
  ],
  selectedIndex: 1,
};

export function Form23({
  legend,
  options = [],
  selectedIndex = 0,
  className,
}: Form23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2">
        {legend && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {legend}
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          {options.map((opt, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-2.5 rounded-md border p-2 transition-colors",
                idx === selectedIndex
                  ? "border-primary border-dashed bg-muted"
                  : "border-border bg-card hover:bg-muted/40"
              )}
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                  idx === selectedIndex
                    ? "border-primary"
                    : "border-border"
                )}
                aria-hidden="true"
              >
                {idx === selectedIndex && (
                  <span className="size-2 rounded-full bg-primary" />
                )}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold text-card-foreground">
                  {opt.label}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {opt.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
