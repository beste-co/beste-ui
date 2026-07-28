"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search2Props {
  query?: string;
  resultCount?: number;
  className?: string;
}

export const search2Demo: Search2Props = {
  query: "design tokens",
  resultCount: 42,
};

export function Search2({
  query = "",
  resultCount,
  className,
}: Search2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-2 rounded-lg border-2 border-primary bg-card px-3 py-2 shadow-sm">
        <Search
          className="size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <span className="flex-1 truncate text-sm text-card-foreground">
          {query}
          <span
            className="ml-0.5 inline-block h-4 w-px animate-pulse bg-primary align-middle"
            aria-hidden="true"
          />
        </span>
        {typeof resultCount === "number" && (
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {resultCount}
          </span>
        )}
        <button
          type="button"
          className="flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-card-foreground"
          aria-label="Clear"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
