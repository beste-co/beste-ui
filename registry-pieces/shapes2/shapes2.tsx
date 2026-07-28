"use client";

import { cn } from "@/lib/utils";

interface Shapes2Props {
  className?: string;
}

export const shapes2Demo: Shapes2Props = {};

export function Shapes2({ className }: Shapes2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-2.5" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          className="size-10 text-amber-400"
          fill="currentColor"
        >
          <polygon points="12,3 22,21 2,21" />
        </svg>
        <span className="size-10 rounded-full bg-emerald-500" />
        <span className="size-10 rounded-md bg-foreground" />
      </div>
    </div>
  );
}
