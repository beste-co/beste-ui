"use client";

import { cn } from "@/lib/utils";

interface Shapes29Props {
  className?: string;
}

export const shapes29Demo: Shapes29Props = {};

export function Shapes29({ className }: Shapes29Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex h-16 items-center gap-1" aria-hidden="true">
        <span className="h-1/3 w-1 rounded-full bg-foreground" />
        <span className="h-1/2 w-1 rounded-full bg-foreground" />
        <span className="h-3/4 w-1 rounded-full bg-foreground" />
        <span className="h-full w-1 rounded-full bg-foreground" />
        <span className="h-2/3 w-1 rounded-full bg-foreground" />
        <span className="h-1/2 w-1 rounded-full bg-muted" />
        <span className="h-3/4 w-1 rounded-full bg-muted" />
        <span className="h-2/3 w-1 rounded-full bg-muted" />
        <span className="h-1/3 w-1 rounded-full bg-muted" />
        <span className="h-1/2 w-1 rounded-full bg-muted" />
        <span className="h-1/4 w-1 rounded-full bg-muted" />
        <span className="h-1/3 w-1 rounded-full bg-muted" />
      </div>
    </div>
  );
}
