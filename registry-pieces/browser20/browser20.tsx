"use client";

import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser20Props {
  query?: string;
  current?: number;
  total?: number;
  className?: string;
}

export const browser20Demo: Browser20Props = {
  query: "onboarding",
  current: 3,
  total: 12,
};

export function Browser20({
  query = "",
  current = 0,
  total = 0,
  className,
}: Browser20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1.5 shadow-md">
        <Search
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <span className="flex-1 truncate text-sm text-card-foreground">
          {query}
        </span>
        <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
          {current}/{total}
        </span>
        <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
        <button
          type="button"
          aria-label="Previous match"
          className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <ChevronUp className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next match"
          className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <ChevronDown className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Close find"
          className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
