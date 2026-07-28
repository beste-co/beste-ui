"use client";

import { cn } from "@/lib/utils";

interface Shapes73Props {
  className?: string;
}

export const shapes73Demo: Shapes73Props = {};

export function Shapes73({ className }: Shapes73Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="relative h-28 w-44 overflow-hidden rounded-md border border-border bg-muted"
        aria-hidden="true"
      >
        <span className="absolute inset-y-0 left-1/2 right-0 bg-emerald-500/20" />
        <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-card" />
        <span className="absolute left-1/2 top-1/2 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-foreground bg-card">
          <span className="size-1 rounded-full bg-foreground" />
        </span>
      </div>
    </div>
  );
}
