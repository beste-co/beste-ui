"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes42Props {
  className?: string;
}

export const shapes42Demo: Shapes42Props = {};

export function Shapes42({ className }: Shapes42Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col overflow-hidden rounded-md bg-foreground"
        aria-hidden="true"
      >
        <div className="flex items-center gap-1.5 px-3 py-2">
          <span className="size-1.5 rounded-full bg-rose-500" />
          <span className="size-1.5 rounded-full bg-amber-400" />
          <span className="size-1.5 rounded-full bg-emerald-500" />
        </div>
        <div className="flex flex-col gap-1.5 px-3 pb-3">
          <div className="flex items-center gap-1.5">
            <ChevronRight className="size-3 text-emerald-400" />
            <span className="h-1 w-16 rounded-full bg-background/50" />
          </div>
          <span className="ml-4 h-1 w-20 rounded-full bg-background/30" />
          <span className="ml-4 h-1 w-12 rounded-full bg-background/30" />
          <div className="flex items-center gap-1.5">
            <ChevronRight className="size-3 text-emerald-400" />
            <span className="h-2 w-1 animate-pulse bg-background" />
          </div>
        </div>
      </div>
    </div>
  );
}
