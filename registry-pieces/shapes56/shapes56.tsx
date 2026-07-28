"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes56Props {
  className?: string;
}

export const shapes56Demo: Shapes56Props = {};

export function Shapes56({ className }: Shapes56Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm"
        aria-hidden="true"
      >
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="h-1.5 w-full rounded-full bg-muted" />
        <span className="h-1.5 w-3/4 rounded-full bg-muted" />
        <div className="mt-1 flex items-center gap-2">
          <span className="size-6 shrink-0 rounded-full bg-muted" />
          <div className="flex flex-1 flex-col gap-1">
            <span className="h-1.5 w-12 rounded-full bg-foreground/70" />
            <span className="h-1 w-8 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
