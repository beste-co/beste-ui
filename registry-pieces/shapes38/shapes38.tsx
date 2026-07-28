"use client";

import { cn } from "@/lib/utils";

interface Shapes38Props {
  className?: string;
}

export const shapes38Demo: Shapes38Props = {};

export function Shapes38({ className }: Shapes38Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-32 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm"
        aria-hidden="true"
      >
        <span className="h-20 w-full bg-muted" />
        <div className="flex flex-col gap-2 p-2.5">
          <span className="h-1.5 w-3/4 rounded-full bg-foreground/70" />
          <div className="flex items-center justify-between gap-2">
            <span className="h-2.5 w-10 rounded-sm bg-foreground" />
            <span className="size-5 rounded-full bg-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
