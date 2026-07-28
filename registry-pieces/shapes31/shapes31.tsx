"use client";

import { cn } from "@/lib/utils";

interface Shapes31Props {
  className?: string;
}

export const shapes31Demo: Shapes31Props = {};

export function Shapes31({ className }: Shapes31Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="grid w-48 grid-cols-3 gap-3 rounded-md border border-border bg-card p-3 shadow-sm"
        aria-hidden="true"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="size-6 rounded-md bg-muted" />
            <span className="h-1 w-full rounded-full bg-foreground/70" />
            <span className="h-1 w-3/4 rounded-full bg-muted" />
            <span className="h-1 w-2/3 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
