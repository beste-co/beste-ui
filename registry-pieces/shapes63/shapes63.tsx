"use client";

import { cn } from "@/lib/utils";

interface Shapes63Props {
  className?: string;
}

export const shapes63Demo: Shapes63Props = {};

export function Shapes63({ className }: Shapes63Props) {
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
        <div className="relative">
          <span className="size-12 rounded-full bg-muted" />
          <span className="absolute bottom-0.5 right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-card" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="h-1.5 w-16 rounded-full bg-foreground/70" />
          <span className="h-1 w-12 rounded-full bg-muted" />
        </div>
        <div className="mt-1 flex w-full gap-1.5">
          <span className="h-6 flex-1 rounded-sm bg-foreground" />
          <span className="h-6 flex-1 rounded-sm border border-border" />
        </div>
      </div>
    </div>
  );
}
