"use client";

import { cn } from "@/lib/utils";

interface Shapes46Props {
  className?: string;
}

export const shapes46Demo: Shapes46Props = {};

export function Shapes46({ className }: Shapes46Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-48 items-center gap-3" aria-hidden="true">
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="h-2 w-3/4 rounded-full bg-foreground/70" />
          <span className="h-2 w-1/2 rounded-full bg-foreground/70" />
          <span className="h-1 w-full rounded-full bg-muted" />
          <span className="h-1 w-2/3 rounded-full bg-muted" />
          <span className="mt-1 h-4 w-12 rounded-sm bg-foreground" />
        </div>
        <span className="h-24 w-16 shrink-0 rounded-md bg-muted" />
      </div>
    </div>
  );
}
