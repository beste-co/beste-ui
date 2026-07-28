"use client";

import { cn } from "@/lib/utils";

interface Shapes68Props {
  className?: string;
}

export const shapes68Demo: Shapes68Props = {};

export function Shapes68({ className }: Shapes68Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-48 flex-col gap-2.5" aria-hidden="true">
        <div className="flex items-center">
          <span className="size-4 rounded-full bg-emerald-500" />
          <span className="h-0.5 flex-1 bg-emerald-500" />
          <span className="flex size-4 items-center justify-center rounded-full border-2 border-foreground bg-card">
            <span className="size-1.5 rounded-full bg-foreground" />
          </span>
          <span className="h-0.5 flex-1 bg-muted" />
          <span className="size-4 rounded-full border-2 border-muted bg-card" />
        </div>
        <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-3">
          <div className="flex flex-col gap-1">
            <span className="h-1 w-10 rounded-full bg-muted" />
            <span className="h-6 w-full rounded-sm border border-border bg-background" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="h-1 w-12 rounded-full bg-muted" />
            <span className="h-6 w-full rounded-sm border border-border bg-background" />
          </div>
          <div className="mt-1 flex justify-between">
            <span className="h-5 w-14 rounded-sm border border-border" />
            <span className="h-5 w-14 rounded-sm bg-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
