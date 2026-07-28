"use client";

import { cn } from "@/lib/utils";

interface Shapes17Props {
  className?: string;
}

export const shapes17Demo: Shapes17Props = {};

export function Shapes17({ className }: Shapes17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-44 flex-col gap-2.5" aria-hidden="true">
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          <span className="h-full w-1/2 bg-foreground" />
          <span className="h-full w-1/4 bg-amber-400" />
          <span className="h-full w-1/4 bg-emerald-500" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-foreground" />
            <span className="h-1 w-4 rounded-full bg-muted" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-400" />
            <span className="h-1 w-4 rounded-full bg-muted" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="h-1 w-4 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
