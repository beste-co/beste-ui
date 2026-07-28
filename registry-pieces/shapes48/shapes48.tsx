"use client";

import { cn } from "@/lib/utils";

interface Shapes48Props {
  className?: string;
}

export const shapes48Demo: Shapes48Props = {};

export function Shapes48({ className }: Shapes48Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-44 flex-col items-center gap-2" aria-hidden="true">
        <div className="flex h-4 items-center gap-1.5 rounded-full border border-border bg-card px-2">
          <span className="size-1 rounded-full bg-emerald-500" />
          <span className="h-1 w-8 rounded-full bg-muted" />
        </div>
        <span className="h-2.5 w-2/3 rounded-full bg-foreground/70" />
        <span className="h-2.5 w-1/2 rounded-full bg-foreground/70" />
        <span className="h-1 w-3/4 rounded-full bg-muted" />
        <span className="mt-1 h-4 w-14 rounded-sm bg-foreground" />
      </div>
    </div>
  );
}
