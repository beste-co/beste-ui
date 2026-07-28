"use client";

import { cn } from "@/lib/utils";

interface Shapes58Props {
  className?: string;
}

export const shapes58Demo: Shapes58Props = {};

export function Shapes58({ className }: Shapes58Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-48 flex-col items-center gap-3" aria-hidden="true">
        <span className="h-1 w-24 rounded-full bg-muted" />
        <div className="grid w-full grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="h-6 rounded-sm bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
