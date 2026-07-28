"use client";

import { cn } from "@/lib/utils";

interface Shapes12Props {
  className?: string;
}

export const shapes12Demo: Shapes12Props = {};

export function Shapes12({ className }: Shapes12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex -space-x-3" aria-hidden="true">
        <span className="size-10 rounded-full border-2 border-card bg-foreground" />
        <span className="size-10 rounded-full border-2 border-card bg-amber-400" />
        <span className="size-10 rounded-full border-2 border-card bg-emerald-500" />
      </div>
    </div>
  );
}
