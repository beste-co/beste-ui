"use client";

import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search15Props {
  scope?: string;
  placeholder?: string;
  bordered?: boolean;
  className?: string;
}

export const search15Demo: Search15Props = {
  scope: "in: workspace",
  placeholder: "Search issues, docs, and threads…",
  bordered: false,
};

export function Search15({
  scope = "All",
  placeholder = "Search…",
  bordered = false,
  className,
}: Search15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center rounded-lg bg-card shadow-sm", bordered && "border border-border")}>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-l-lg border-r border-border bg-muted/60 px-3 py-2 text-xs font-medium text-card-foreground hover:bg-muted"
        >
          {scope}
          <ChevronDown
            className="size-3 text-muted-foreground"
            aria-hidden="true"
          />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2">
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-muted-foreground">
            {placeholder}
          </span>
        </div>
      </div>
    </div>
  );
}
