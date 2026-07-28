"use client";

import { cn } from "@/lib/utils";

interface Shapes26Props {
  className?: string;
}

export const shapes26Demo: Shapes26Props = {};

export function Shapes26({ className }: Shapes26Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="size-2 rounded-full bg-muted" />
        <span className="size-2 rounded-full bg-muted" />
        <span className="h-2 w-6 rounded-full bg-foreground" />
        <span className="size-2 rounded-full bg-muted" />
        <span className="size-2 rounded-full bg-muted" />
      </div>
    </div>
  );
}
