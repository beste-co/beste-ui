"use client";

import { cn } from "@/lib/utils";

interface Shapes54Props {
  className?: string;
}

export const shapes54Demo: Shapes54Props = {};

export function Shapes54({ className }: Shapes54Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-48 items-center gap-2.5 rounded-md border border-border bg-card p-3"
        aria-hidden="true"
      >
        <div className="flex flex-1 flex-col gap-1">
          <span className="h-1.5 w-3/4 rounded-full bg-foreground/70" />
          <span className="h-1 w-full rounded-full bg-muted" />
        </div>
        <div className="flex shrink-0 gap-1.5">
          <span className="h-5 w-10 rounded-sm border border-border" />
          <span className="h-5 w-10 rounded-sm bg-foreground" />
        </div>
      </div>
    </div>
  );
}
