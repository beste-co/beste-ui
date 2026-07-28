"use client";

import { cn } from "@/lib/utils";

interface Shapes1Props {
  className?: string;
}

export const shapes1Demo: Shapes1Props = {};

export function Shapes1({ className }: Shapes1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative size-20" aria-hidden="true">
        <span className="absolute right-0 top-0 size-14 rounded-md bg-foreground" />
        <span className="absolute right-2 top-2 size-14 rounded-md border border-border bg-amber-100" />
        <span className="absolute right-4 top-4 size-14 rounded-md border border-border bg-card shadow-md" />
      </div>
    </div>
  );
}
