"use client";

import { cn } from "@/lib/utils";

interface Shapes35Props {
  className?: string;
}

export const shapes35Demo: Shapes35Props = {};

export function Shapes35({ className }: Shapes35Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 items-center justify-between gap-3 rounded-md bg-foreground p-3"
        aria-hidden="true"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="h-1.5 w-3/4 rounded-full bg-background" />
          <span className="h-1 w-1/2 rounded-full bg-background/40" />
        </div>
        <span className="h-5 w-12 shrink-0 rounded-sm bg-background" />
      </div>
    </div>
  );
}
