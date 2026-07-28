"use client";

import { cn } from "@/lib/utils";

interface Shapes65Props {
  className?: string;
}

export const shapes65Demo: Shapes65Props = {};

export function Shapes65({ className }: Shapes65Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col gap-2.5 rounded-md border border-border bg-card p-3 shadow-sm"
        aria-hidden="true"
      >
        <span className="mx-auto h-2 w-1/2 rounded-full bg-foreground/70" />
        <div className="flex flex-col gap-1 mt-1">
          <span className="h-1 w-10 rounded-full bg-muted" />
          <span className="h-6 w-full rounded-sm border border-border bg-background" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="h-1 w-12 rounded-full bg-muted" />
          <span className="h-6 w-full rounded-sm border border-border bg-background" />
        </div>
        <span className="h-6 w-full rounded-sm bg-foreground" />
      </div>
    </div>
  );
}
