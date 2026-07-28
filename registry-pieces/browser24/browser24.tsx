"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser24Props {
  zoom?: number;
  className?: string;
}

export const browser24Demo: Browser24Props = {
  zoom: 110,
};

export function Browser24({ zoom = 100, className }: Browser24Props) {
  const pct = Math.max(25, Math.min(500, Math.round(zoom)));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center overflow-hidden rounded-full border border-border bg-card shadow-sm">
        <button
          type="button"
          aria-label="Zoom out"
          className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <Minus className="size-3.5" aria-hidden="true" />
        </button>
        <span className="flex h-8 min-w-12 items-center justify-center border-x border-border px-2 font-mono text-xs font-semibold tabular-nums text-card-foreground">
          {pct}%
        </span>
        <button
          type="button"
          aria-label="Zoom in"
          className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Reset zoom"
          className="flex size-8 items-center justify-center border-l border-border text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
