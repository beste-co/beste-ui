"use client";

import { cn } from "@/lib/utils";

interface Shapes18Props {
  className?: string;
}

export const shapes18Demo: Shapes18Props = {};

export function Shapes18({ className }: Shapes18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 items-start gap-2.5 rounded-md border border-border bg-card p-3 shadow-sm"
        aria-hidden="true"
      >
        <span className="size-7 shrink-0 rounded-full bg-amber-400" />
        <div className="flex flex-1 flex-col gap-1.5 pt-1">
          <span className="h-1.5 w-3/4 rounded-full bg-foreground" />
          <span className="h-1.5 w-1/2 rounded-full bg-muted" />
        </div>
        <span className="size-2 shrink-0 rounded-full bg-rose-500" />
      </div>
    </div>
  );
}
