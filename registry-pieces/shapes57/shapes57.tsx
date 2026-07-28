"use client";

import { cn } from "@/lib/utils";

interface Shapes57Props {
  className?: string;
}

export const shapes57Demo: Shapes57Props = {};

export function Shapes57({ className }: Shapes57Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col items-center gap-2 rounded-md border border-border bg-card p-3 shadow-sm"
        aria-hidden="true"
      >
        <span className="size-10 rounded-full bg-muted" />
        <span className="h-1.5 w-full rounded-full bg-muted" />
        <span className="h-1.5 w-5/6 rounded-full bg-muted" />
        <span className="h-1.5 w-2/3 rounded-full bg-muted" />
        <div className="mt-1 flex flex-col items-center gap-1">
          <span className="h-1.5 w-14 rounded-full bg-foreground/70" />
          <span className="h-1 w-10 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
