"use client";

import { cn } from "@/lib/utils";

interface Shapes45Props {
  className?: string;
}

export const shapes45Demo: Shapes45Props = {};

export function Shapes45({ className }: Shapes45Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-48 items-stretch gap-2.5 rounded-md border border-border bg-card p-2.5 shadow-sm"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center justify-center gap-1 rounded-sm bg-foreground px-3 py-2">
          <span className="h-1 w-5 rounded-full bg-background/50" />
          <span className="h-3 w-6 rounded-sm bg-background" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          <span className="h-1.5 w-full rounded-full bg-foreground/70" />
          <span className="h-1.5 w-3/4 rounded-full bg-foreground/70" />
          <div className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span className="h-1 w-12 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
