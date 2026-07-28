"use client";

import { cn } from "@/lib/utils";

interface Shapes74Props {
  className?: string;
}

export const shapes74Demo: Shapes74Props = {};

export function Shapes74({ className }: Shapes74Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm"
        aria-hidden="true"
      >
        <span className="h-16 w-full rounded-sm bg-muted" />
        <div className="flex flex-col gap-1">
          <span className="h-1.5 w-3/4 rounded-full bg-foreground/70" />
          <span className="h-1 w-1/2 rounded-full bg-muted" />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative h-1.5 flex-1 rounded-full bg-muted">
            <span className="absolute inset-y-0 left-0 w-3/5 rounded-full bg-emerald-500" />
          </div>
          <span className="h-1 w-6 rounded-full bg-foreground/70" />
        </div>
      </div>
    </div>
  );
}
