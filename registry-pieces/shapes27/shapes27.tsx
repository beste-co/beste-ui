"use client";

import { cn } from "@/lib/utils";

interface Shapes27Props {
  className?: string;
}

export const shapes27Demo: Shapes27Props = {};

export function Shapes27({ className }: Shapes27Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative p-3" aria-hidden="true">
        <div className="absolute inset-0 rounded-lg bg-foreground/10" />
        <div className="relative flex w-44 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-lg">
          <span className="h-1.5 w-2/3 rounded-full bg-foreground" />
          <span className="h-1 w-full rounded-full bg-muted" />
          <span className="h-1 w-3/4 rounded-full bg-muted" />
          <div className="mt-1 flex justify-end gap-1.5">
            <span className="h-3.5 w-10 rounded-sm bg-muted" />
            <span className="h-3.5 w-10 rounded-sm bg-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
