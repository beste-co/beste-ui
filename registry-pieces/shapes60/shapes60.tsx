"use client";

import { cn } from "@/lib/utils";

interface Shapes60Props {
  className?: string;
}

export const shapes60Demo: Shapes60Props = {};

export function Shapes60({ className }: Shapes60Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-48 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm"
        aria-hidden="true"
      >
        <div className="flex flex-col gap-1">
          <span className="h-1 w-10 rounded-full bg-muted" />
          <span className="h-6 w-full rounded-sm border border-border bg-background" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="h-1 w-12 rounded-full bg-muted" />
          <span className="h-6 w-full rounded-sm border border-border bg-background" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="h-1 w-14 rounded-full bg-muted" />
          <span className="h-12 w-full rounded-sm border border-border bg-background" />
        </div>
        <span className="mt-1 h-6 w-full rounded-sm bg-foreground" />
      </div>
    </div>
  );
}
