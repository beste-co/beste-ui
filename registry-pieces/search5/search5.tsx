"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search5Props {
  placeholder?: string;
  filters?: string[];
  className?: string;
}

export const search5Demo: Search5Props = {
  placeholder: "Search issues…",
  filters: ["status: open", "priority: high", "label: bug"],
};

export function Search5({
  placeholder = "Search…",
  filters = [],
  className,
}: Search5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-wrap items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
        <Search
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        {filters.map((chip, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 py-0.5 pl-2 pr-1 text-xs font-medium text-sky-700 dark:text-sky-300"
          >
            {chip}
            <button
              type="button"
              className="flex size-4 items-center justify-center rounded hover:bg-sky-500/20"
              aria-label={`Remove ${chip}`}
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </span>
        ))}
        <span className="min-w-12 flex-1 text-sm text-muted-foreground">
          {placeholder}
        </span>
      </div>
    </div>
  );
}
