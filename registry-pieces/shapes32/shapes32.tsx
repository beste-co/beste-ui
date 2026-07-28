"use client";

import { cn } from "@/lib/utils";

interface Shapes32Props {
  className?: string;
}

export const shapes32Demo: Shapes32Props = {};

export function Shapes32({ className }: Shapes32Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col gap-2.5 rounded-md border border-border bg-card p-3 shadow-sm"
        aria-hidden="true"
      >
        <div className="flex flex-col gap-1.5">
          <span className="h-1.5 w-full rounded-full bg-muted" />
          <span className="h-1.5 w-5/6 rounded-full bg-muted" />
          <span className="h-1.5 w-2/3 rounded-full bg-muted" />
        </div>
        <div className="flex items-center gap-2">
          <span className="size-7 shrink-0 rounded-full bg-muted" />
          <div className="flex flex-col gap-1">
            <span className="h-1.5 w-14 rounded-full bg-foreground/70" />
            <span className="h-1 w-10 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
