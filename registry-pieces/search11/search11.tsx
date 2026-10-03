"use client";

import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search11Props {
  query?: string;
  hint?: string;
  skeletonRows?: number;
  bordered?: boolean;
  className?: string;
}

export const search11Demo: Search11Props = {
  query: "design tokens",
  skeletonRows: 3,
  bordered: false,
};

export function Search11({
  query = "",
  hint,
  skeletonRows = 3,
  bordered = false,
  className,
}: Search11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-xl bg-card shadow-xl", bordered && "border border-border")}>
        <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
          <Search
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-card-foreground">
            {query}
          </span>
          <Loader2
            className="size-4 shrink-0 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col gap-2 p-3">
          {hint && (
            <span className="text-xs text-muted-foreground">{hint}</span>
          )}
          {Array.from({ length: skeletonRows }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2"
              aria-hidden="true"
            >
              <span className="size-3.5 shrink-0 animate-pulse rounded bg-muted" />
              <span
                className={cn(
                  "h-3 animate-pulse rounded bg-muted",
                  idx === 0 && "w-3/5",
                  idx === 1 && "w-4/5",
                  idx === 2 && "w-2/3"
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
