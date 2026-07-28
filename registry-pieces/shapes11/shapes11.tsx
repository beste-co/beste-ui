"use client";

import { cn } from "@/lib/utils";

interface Shapes11Props {
  className?: string;
}

export const shapes11Demo: Shapes11Props = {};

export function Shapes11({ className }: Shapes11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="h-7 w-14 rounded-full bg-amber-200" />
        <span className="h-7 w-20 rounded-full bg-emerald-200" />
        <span className="h-7 w-12 rounded-full border border-border bg-background" />
      </div>
    </div>
  );
}
