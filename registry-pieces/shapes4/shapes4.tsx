"use client";

import { cn } from "@/lib/utils";

interface Shapes4Props {
  className?: string;
}

export const shapes4Demo: Shapes4Props = {};

export function Shapes4({ className }: Shapes4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex flex-col items-center gap-4"
        aria-hidden="true"
      >
        <div className="relative h-2 w-40 rounded-full bg-muted">
          <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-orange-500" />
          <span className="absolute -top-2 left-1/3 size-6 -translate-x-1/2 rounded-full border-2 border-orange-500 bg-card shadow-sm" />
        </div>
        <div className="relative h-2 w-40 rounded-full bg-muted">
          <span className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-foreground" />
          <span className="absolute -top-2 left-2/3 size-6 -translate-x-1/2 rounded-full border-2 border-foreground bg-card shadow-sm" />
        </div>
      </div>
    </div>
  );
}
