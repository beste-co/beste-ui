"use client";

import { cn } from "@/lib/utils";

interface Shapes36Props {
  className?: string;
}

export const shapes36Demo: Shapes36Props = {};

export function Shapes36({ className }: Shapes36Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-48 items-center gap-3 rounded-md border border-border bg-card p-2 shadow-sm"
        aria-hidden="true"
      >
        <span className="size-4 shrink-0 rounded-sm bg-foreground" />
        <div className="flex flex-1 items-center gap-2.5">
          <span className="h-1 w-6 rounded-full bg-muted" />
          <span className="h-1 w-8 rounded-full bg-muted" />
          <span className="h-1 w-5 rounded-full bg-muted" />
        </div>
        <span className="h-4 w-10 shrink-0 rounded-sm bg-foreground" />
      </div>
    </div>
  );
}
