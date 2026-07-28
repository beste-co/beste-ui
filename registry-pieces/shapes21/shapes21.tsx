"use client";

import { cn } from "@/lib/utils";

interface Shapes21Props {
  className?: string;
}

export const shapes21Demo: Shapes21Props = {};

export function Shapes21({ className }: Shapes21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center" aria-hidden="true">
        <span className="size-5 rounded-full bg-emerald-500" />
        <span className="h-0.5 w-5 bg-emerald-500" />
        <span className="size-5 rounded-full bg-emerald-500" />
        <span className="h-0.5 w-5 bg-muted" />
        <span className="flex size-5 items-center justify-center rounded-full border-2 border-foreground bg-card">
          <span className="size-1.5 rounded-full bg-foreground" />
        </span>
        <span className="h-0.5 w-5 bg-muted" />
        <span className="size-5 rounded-full border-2 border-muted bg-card" />
      </div>
    </div>
  );
}
