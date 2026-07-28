"use client";

import { cn } from "@/lib/utils";

interface Shapes43Props {
  className?: string;
}

export const shapes43Demo: Shapes43Props = {};

export function Shapes43({ className }: Shapes43Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col divide-y divide-border rounded-md border border-border bg-card"
        aria-hidden="true"
      >
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="h-1.5 w-16 rounded-full bg-foreground/70" />
          <div className="relative h-3.5 w-7 rounded-full bg-emerald-500">
            <span className="absolute right-0.5 top-0.5 size-2.5 rounded-full bg-card" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="h-1.5 w-20 rounded-full bg-foreground/70" />
          <div className="relative h-3.5 w-7 rounded-full bg-muted">
            <span className="absolute left-0.5 top-0.5 size-2.5 rounded-full bg-card" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="h-1.5 w-12 rounded-full bg-foreground/70" />
          <span className="h-1 w-10 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
