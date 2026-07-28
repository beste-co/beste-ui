"use client";

import { cn } from "@/lib/utils";

interface Shapes8Props {
  className?: string;
}

export const shapes8Demo: Shapes8Props = {};

export function Shapes8({ className }: Shapes8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex h-20 items-end gap-2" aria-hidden="true">
        <span className="h-1/2 w-3 rounded-sm bg-foreground" />
        <span className="h-3/4 w-3 rounded-sm bg-foreground" />
        <span className="h-1/3 w-3 rounded-sm bg-foreground" />
        <span className="h-full w-3 rounded-sm bg-emerald-500" />
        <span className="h-2/3 w-3 rounded-sm bg-foreground" />
      </div>
    </div>
  );
}
