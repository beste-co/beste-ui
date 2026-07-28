"use client";

import { cn } from "@/lib/utils";

interface Shapes41Props {
  className?: string;
}

export const shapes41Demo: Shapes41Props = {};

export function Shapes41({ className }: Shapes41Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-48 grid-cols-3 gap-1.5" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-2"
          >
            <span className="h-1 w-8 rounded-full bg-muted" />
            <span className="h-3 w-10 rounded-sm bg-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}
