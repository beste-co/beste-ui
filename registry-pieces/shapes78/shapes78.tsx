"use client";

import { cn } from "@/lib/utils";

interface Shapes78Props {
  className?: string;
}

export const shapes78Demo: Shapes78Props = {};

export function Shapes78({ className }: Shapes78Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="grid h-28 w-44 grid-cols-3 grid-rows-2 gap-1.5"
        aria-hidden="true"
      >
        <div className="col-span-2 row-span-2 rounded-md bg-muted" />
        <div className="rounded-md bg-muted" />
        <div className="relative overflow-hidden rounded-md bg-muted">
          <span className="absolute inset-0 flex items-center justify-center bg-foreground/40">
            <span className="h-1.5 w-5 rounded-full bg-background" />
          </span>
        </div>
      </div>
    </div>
  );
}
