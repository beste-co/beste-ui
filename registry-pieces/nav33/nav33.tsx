"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Nav33Props {
  current?: number;
  total?: number;
  className?: string;
}

export const nav33Demo: Nav33Props = {
  current: 3,
  total: 8,
};

export function Nav33({
  current = 1,
  total = 1,
  className,
}: Nav33Props) {
  const clampedTotal = Math.max(1, total);
  const clamped = Math.max(1, Math.min(current, clampedTotal));

  const pages: (number | "dots")[] = [];
  if (clampedTotal <= 5) {
    for (let i = 1; i <= clampedTotal; i++) pages.push(i);
  } else {
    pages.push(1);
    if (clamped > 3) pages.push("dots");
    const start = Math.max(2, clamped - 1);
    const end = Math.min(clampedTotal - 1, clamped + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (clamped < clampedTotal - 2) pages.push("dots");
    pages.push(clampedTotal);
  }

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={clamped === 1}
          className="flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground disabled:opacity-40"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
        </button>
        {pages.map((p, i) =>
          p === "dots" ? (
            <span
              key={`dots-${i}`}
              className="px-1 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-current={p === clamped ? "page" : undefined}
              className={cn(
                "flex size-8 items-center justify-center rounded-md border text-sm font-medium tabular-nums transition-colors",
                p === clamped
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-card-foreground hover:bg-muted"
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          aria-label="Next page"
          disabled={clamped === clampedTotal}
          className="flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground disabled:opacity-40"
        >
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
