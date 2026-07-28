"use client";

import { cn } from "@/lib/utils";

interface Shapes3Props {
  className?: string;
}

export const shapes3Demo: Shapes3Props = {};

export function Shapes3({ className }: Shapes3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col gap-2 rounded-md bg-foreground p-4"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-8 rounded-full bg-emerald-400" />
          <span className="h-1.5 w-16 rounded-full bg-background/40" />
        </div>
        <span className="h-1.5 w-28 rounded-full bg-background/40" />
        <span className="h-1.5 w-20 rounded-full bg-background/40" />
      </div>
    </div>
  );
}
