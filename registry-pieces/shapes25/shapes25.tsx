"use client";

import { cn } from "@/lib/utils";

interface Shapes25Props {
  className?: string;
}

export const shapes25Demo: Shapes25Props = {};

export function Shapes25({ className }: Shapes25Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-44 flex-col" aria-hidden="true">
        <div className="flex items-center gap-5 pb-2">
          <span className="h-1.5 w-8 rounded-full bg-foreground" />
          <span className="h-1.5 w-10 rounded-full bg-muted" />
          <span className="h-1.5 w-6 rounded-full bg-muted" />
        </div>
        <div className="relative h-px w-full bg-border">
          <span className="absolute -top-px left-0 h-0.5 w-8 rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  );
}
