"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Nav15Props {
  current?: number;
  total?: number;
  className?: string;
}

export const nav15Demo: Nav15Props = {
  current: 4,
  total: 12,
};

export function Nav15({
  current = 1,
  total = 1,
  className,
}: Nav15Props) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const visible: (number | "ellipsis")[] = [];

  if (total <= 7) {
    visible.push(...pages);
  } else {
    visible.push(1);
    if (current > 3) visible.push("ellipsis");
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
      visible.push(p);
    }
    if (current < total - 2) visible.push("ellipsis");
    visible.push(total);
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
          disabled={current <= 1}
          className="flex size-8 items-center justify-center rounded-md border border-border bg-card text-card-foreground disabled:opacity-40"
          aria-label="Previous"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
        </button>
        {visible.map((p, idx) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex size-8 items-center justify-center text-muted-foreground"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={cn(
                "flex size-8 items-center justify-center rounded-md border font-mono text-xs transition-colors",
                p === current
                  ? "border-primary bg-primary font-semibold text-primary-foreground"
                  : "border-border bg-card text-card-foreground hover:bg-muted"
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          disabled={current >= total}
          className="flex size-8 items-center justify-center rounded-md border border-border bg-card text-card-foreground disabled:opacity-40"
          aria-label="Next"
        >
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
