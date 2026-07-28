"use client";

import { cn } from "@/lib/utils";

interface Shapes53Props {
  className?: string;
}

export const shapes53Demo: Shapes53Props = {};

export function Shapes53({ className }: Shapes53Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-48 flex-col gap-2 rounded-md border border-border bg-card p-3"
        aria-hidden="true"
      >
        <span className="h-1.5 w-2/3 rounded-full bg-foreground/70" />
        <span className="h-1 w-full rounded-full bg-muted" />
        <div className="mt-1 flex gap-1">
          <span className="h-6 flex-1 rounded-sm border border-border bg-background" />
          <span className="h-6 w-12 shrink-0 rounded-sm bg-foreground" />
        </div>
      </div>
    </div>
  );
}
