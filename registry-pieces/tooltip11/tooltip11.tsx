"use client";

import { cn } from "@/lib/utils";

interface Tooltip11Props {
  term?: string;
  definition?: string;
  source?: string;
  bordered?: boolean;
  className?: string;
}

export const tooltip11Demo: Tooltip11Props = {
  term: "Churn rate",
  definition:
    "Percentage of customers who cancel during a period, divided by customers at the start of that period.",
  bordered: false,
};

export function Tooltip11({
  term,
  definition,
  source,
  bordered = false,
  className,
}: Tooltip11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative">
        <div className={cn("flex w-64 flex-col gap-2 rounded-lg bg-card p-3 shadow-lg", bordered && "border border-border")}>
          {term && (
            <span className="text-sm font-semibold text-card-foreground">
              {term}
            </span>
          )}
          {definition && (
            <span className="text-xs leading-snug text-muted-foreground">
              {definition}
            </span>
          )}
          {source && (
            <span className="border-t border-border pt-2 text-xs font-medium text-muted-foreground">
              {source}
            </span>
          )}
        </div>
        <div
          className="absolute -top-1 left-8 size-2 rotate-45 border-l border-t border-border bg-card"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
