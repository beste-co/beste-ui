"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input6Props {
  value?: number;
  min?: number;
  max?: number;
  className?: string;
}

export const input6Demo: Input6Props = {
  value: 4,
  min: 0,
  max: 12,
};

export function Input6({
  value = 0,
  min = 0,
  max = 99,
  className,
}: Input6Props) {
  const canDec = value > min;
  const canInc = value < max;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-stretch overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <button
          type="button"
          disabled={!canDec}
          className="flex size-10 items-center justify-center border-r border-border bg-muted text-muted-foreground hover:bg-muted-foreground/10 disabled:opacity-40"
          aria-label="Decrease"
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span className="flex min-w-14 items-center justify-center px-3 font-mono text-sm font-semibold text-card-foreground">
          {value}
        </span>
        <button
          type="button"
          disabled={!canInc}
          className="flex size-10 items-center justify-center border-l border-border bg-muted text-muted-foreground hover:bg-muted-foreground/10 disabled:opacity-40"
          aria-label="Increase"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
