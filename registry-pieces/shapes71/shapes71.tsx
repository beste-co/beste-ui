"use client";

import { cn } from "@/lib/utils";

interface Shapes71Props {
  className?: string;
}

export const shapes71Demo: Shapes71Props = {};

export function Shapes71({ className }: Shapes71Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-48 items-center gap-2" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-1 flex-col items-center gap-1 rounded-md border border-border bg-card p-2"
          >
            <span className="h-3 w-7 rounded-sm bg-foreground/70" />
            <span className="h-1 w-5 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
