"use client";

import { cn } from "@/lib/utils";

interface Shapes30Props {
  className?: string;
}

export const shapes30Demo: Shapes30Props = {};

export function Shapes30({ className }: Shapes30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-44 flex-col items-center gap-2" aria-hidden="true">
        <span className="h-2.5 w-2/3 rounded-full bg-foreground/70" />
        <span className="h-2.5 w-1/2 rounded-full bg-foreground/70" />
        <div className="mt-1 flex w-full flex-col items-center gap-1">
          <span className="h-1 w-3/4 rounded-full bg-muted" />
          <span className="h-1 w-2/3 rounded-full bg-muted" />
        </div>
        <div className="mt-2 flex justify-center gap-1.5">
          <span className="h-4 w-12 rounded-sm bg-foreground" />
          <span className="h-4 w-12 rounded-sm border border-border" />
        </div>
      </div>
    </div>
  );
}
