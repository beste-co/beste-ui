"use client";

import { CaseSensitive, ChevronDown, ChevronUp, Regex, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor11Props {
  query?: string;
  replace?: string;
  current?: number;
  total?: number;
  className?: string;
}

export const editor11Demo: Editor11Props = {
  query: "onboarding",
  replace: "activation",
  current: 3,
  total: 12,
};

export function Editor11({
  query = "",
  replace = "",
  current = 0,
  total = 0,
  className,
}: Editor11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-md border border-border bg-card px-2 py-1.5 shadow-sm">
        <div className="flex items-center gap-1">
          <div className="flex flex-1 items-center gap-1.5 rounded border border-border bg-card px-2 py-1">
            <span className="flex-1 truncate font-mono text-xs text-card-foreground">
              {query}
            </span>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {current}/{total}
            </span>
          </div>
          <button
            type="button"
            aria-label="Match case"
            className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <CaseSensitive className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Use regex"
            className="flex size-6 items-center justify-center rounded bg-muted text-card-foreground"
            aria-pressed
          >
            <Regex className="size-3.5" aria-hidden="true" />
          </button>
          <div className="h-5 w-px bg-border" aria-hidden="true" />
          <button
            type="button"
            aria-label="Previous"
            className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <ChevronUp className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Close"
            className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex flex-1 items-center gap-1.5 rounded border border-border bg-card px-2 py-1">
            <span className="flex-1 truncate font-mono text-xs text-card-foreground">
              {replace}
            </span>
          </div>
          <button
            type="button"
            className="rounded px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            Replace
          </button>
          <button
            type="button"
            className="rounded bg-foreground px-2 py-1 text-xs font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            All
          </button>
        </div>
      </div>
    </div>
  );
}
