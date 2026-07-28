"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toolbar3Props {
  zoom?: number;
  className?: string;
}

export const toolbar3Demo: Toolbar3Props = {
  zoom: 125,
};

export function Toolbar3({ zoom = 100, className }: Toolbar3Props) {
  const clamped = Math.max(0, Math.min(999, Math.round(zoom)));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <button
          type="button"
          aria-label="Zoom out"
          className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <Minus className="size-3.5" aria-hidden="true" />
        </button>
        <span
          className="flex h-8 min-w-12 items-center justify-center border-x border-border bg-card px-2 font-mono text-xs font-semibold tabular-nums text-card-foreground"
          aria-live="polite"
        >
          {clamped}%
        </span>
        <button
          type="button"
          aria-label="Zoom in"
          className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
