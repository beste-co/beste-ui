"use client";

import { cn } from "@/lib/utils";

interface Shapes52Props {
  className?: string;
}

export const shapes52Demo: Shapes52Props = {};

export function Shapes52({ className }: Shapes52Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col items-center gap-2 rounded-md border border-border bg-card p-4 shadow-sm"
        aria-hidden="true"
      >
        <span className="h-2 w-3/4 rounded-full bg-foreground/70" />
        <span className="h-2 w-1/2 rounded-full bg-foreground/70" />
        <span className="h-1 w-full rounded-full bg-muted" />
        <span className="mt-1 h-5 w-16 rounded-sm bg-foreground" />
      </div>
    </div>
  );
}
