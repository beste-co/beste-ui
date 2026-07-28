"use client";

import { cn } from "@/lib/utils";

interface Shapes39Props {
  className?: string;
}

export const shapes39Demo: Shapes39Props = {};

export function Shapes39({ className }: Shapes39Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-48 gap-2.5 rounded-md border border-border bg-card p-2 shadow-sm"
        aria-hidden="true"
      >
        <span className="h-16 w-14 shrink-0 rounded-sm bg-muted" />
        <div className="flex flex-1 flex-col gap-1.5 py-1">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span className="h-1 w-10 rounded-full bg-muted" />
          </div>
          <span className="h-1.5 w-full rounded-full bg-foreground/70" />
          <span className="h-1.5 w-3/4 rounded-full bg-foreground/70" />
          <span className="h-1 w-1/2 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
