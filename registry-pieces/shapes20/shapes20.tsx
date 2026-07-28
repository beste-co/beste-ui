"use client";

import { cn } from "@/lib/utils";

interface Shapes20Props {
  className?: string;
}

export const shapes20Demo: Shapes20Props = {};

export function Shapes20({ className }: Shapes20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm"
        aria-hidden="true"
      >
        <div className="flex items-center gap-1.5 border-b border-border bg-muted px-3 py-2">
          <span className="size-2 rounded-full bg-rose-500" />
          <span className="size-2 rounded-full bg-amber-400" />
          <span className="size-2 rounded-full bg-emerald-500" />
        </div>
        <div className="flex flex-col gap-1.5 p-3">
          <span className="h-1.5 w-3/4 rounded-full bg-muted" />
          <span className="h-1.5 w-1/2 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
