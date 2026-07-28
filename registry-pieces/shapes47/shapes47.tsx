"use client";

import { cn } from "@/lib/utils";

interface Shapes47Props {
  className?: string;
}

export const shapes47Demo: Shapes47Props = {};

export function Shapes47({ className }: Shapes47Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-48 flex-col items-center gap-2" aria-hidden="true">
        <span className="h-2.5 w-2/3 rounded-full bg-foreground/70" />
        <span className="h-2.5 w-1/2 rounded-full bg-foreground/70" />
        <span className="mt-1 h-1 w-3/4 rounded-full bg-muted" />
        <div className="mt-2 grid w-full grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="h-2.5 w-8 rounded-sm bg-foreground" />
              <span className="h-1 w-10 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
