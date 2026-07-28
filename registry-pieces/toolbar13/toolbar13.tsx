"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Toolbar13Props {
  current?: number;
  total?: number;
  className?: string;
}

export const toolbar13Demo: Toolbar13Props = {
  current: 5,
  total: 24,
};

export function Toolbar13({
  current = 1,
  total = 1,
  className,
}: Toolbar13Props) {
  const clamped = Math.max(1, Math.min(current, Math.max(1, total)));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-card p-1 shadow-sm">
        <button
          type="button"
          aria-label="First page"
          disabled={clamped === 1}
          className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronsLeft className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Previous page"
          disabled={clamped === 1}
          className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
        </button>
        <span className="mx-1 font-mono text-xs tabular-nums text-card-foreground">
          {clamped}{" "}
          <span className="text-muted-foreground">/ {total}</span>
        </span>
        <button
          type="button"
          aria-label="Next page"
          disabled={clamped === total}
          className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Last page"
          disabled={clamped === total}
          className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronsRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
