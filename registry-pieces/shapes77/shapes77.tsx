"use client";

import { cn } from "@/lib/utils";

interface Shapes77Props {
  className?: string;
}

export const shapes77Demo: Shapes77Props = {};

export function Shapes77({ className }: Shapes77Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-48 flex-col gap-2.5" aria-hidden="true">
        <div className="flex gap-2">
          <span className="size-7 shrink-0 rounded-full bg-muted" />
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-12 rounded-full bg-foreground/70" />
              <span className="h-1 w-8 rounded-full bg-muted" />
            </div>
            <span className="h-1 w-full rounded-full bg-muted" />
            <span className="h-1 w-3/4 rounded-full bg-muted" />
          </div>
        </div>
        <div className="ml-9 flex gap-2">
          <span className="size-6 shrink-0 rounded-full bg-muted" />
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-10 rounded-full bg-foreground/70" />
              <span className="h-1 w-6 rounded-full bg-muted" />
            </div>
            <span className="h-1 w-2/3 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
