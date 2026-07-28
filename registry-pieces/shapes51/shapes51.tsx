"use client";

import { cn } from "@/lib/utils";

interface Shapes51Props {
  className?: string;
}

export const shapes51Demo: Shapes51Props = {};

export function Shapes51({ className }: Shapes51Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-48 gap-3 rounded-md border border-border bg-card p-3"
        aria-hidden="true"
      >
        <span className="size-12 shrink-0 rounded-md bg-muted" />
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          <span className="h-1.5 w-3/4 rounded-full bg-foreground/70" />
          <span className="h-1 w-full rounded-full bg-muted" />
          <span className="h-1 w-2/3 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
