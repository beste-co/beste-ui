"use client";

import { cn } from "@/lib/utils";

interface Shapes62Props {
  className?: string;
}

export const shapes62Demo: Shapes62Props = {};

export function Shapes62({ className }: Shapes62Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-48 gap-2.5 rounded-md border border-border bg-card p-3 shadow-sm"
        aria-hidden="true"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="h-1.5 w-3/4 rounded-full bg-foreground/70" />
          <span className="h-1 w-full rounded-full bg-muted" />
          <span className="h-1 w-2/3 rounded-full bg-muted" />
          <div className="mt-1 flex flex-col gap-1">
            <span className="h-1 w-3/4 rounded-full bg-muted" />
            <span className="h-1 w-1/2 rounded-full bg-muted" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="h-5 rounded-sm border border-border bg-background" />
          <span className="h-5 rounded-sm border border-border bg-background" />
          <span className="h-12 rounded-sm border border-border bg-background" />
          <span className="h-5 rounded-sm bg-foreground" />
        </div>
      </div>
    </div>
  );
}
