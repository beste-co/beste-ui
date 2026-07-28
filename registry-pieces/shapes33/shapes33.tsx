"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes33Props {
  className?: string;
}

export const shapes33Demo: Shapes33Props = {};

export function Shapes33({ className }: Shapes33Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-40 flex-col gap-2.5 rounded-md border border-border bg-card p-3 shadow-sm"
        aria-hidden="true"
      >
        <span className="h-1 w-12 rounded-full bg-muted" />
        <div className="flex items-baseline gap-1">
          <span className="h-5 w-12 rounded-sm bg-foreground" />
          <span className="h-1 w-6 rounded-full bg-muted" />
        </div>
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Check className="size-3 text-emerald-500" />
              <span className="h-1 w-20 rounded-full bg-muted" />
            </div>
          ))}
        </div>
        <span className="h-5 w-full rounded-sm bg-foreground" />
      </div>
    </div>
  );
}
