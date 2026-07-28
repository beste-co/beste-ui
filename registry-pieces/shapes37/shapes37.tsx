"use client";

import { cn } from "@/lib/utils";

interface Shapes37Props {
  className?: string;
}

export const shapes37Demo: Shapes37Props = {};

export function Shapes37({ className }: Shapes37Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-48 flex-col gap-2.5 rounded-md border border-border bg-card p-3"
        aria-hidden="true"
      >
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, col) => (
            <div key={col} className="flex flex-col gap-1.5">
              <span className="h-1.5 w-3/4 rounded-full bg-foreground/70" />
              <span className="h-1 w-full rounded-full bg-muted" />
              <span className="h-1 w-2/3 rounded-full bg-muted" />
              <span className="h-1 w-3/4 rounded-full bg-muted" />
            </div>
          ))}
        </div>
        <div className="h-px w-full bg-border" />
        <div className="flex items-center justify-between">
          <span className="h-1 w-12 rounded-full bg-muted" />
          <div className="flex gap-1">
            <span className="size-2 rounded-full bg-muted" />
            <span className="size-2 rounded-full bg-muted" />
            <span className="size-2 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
