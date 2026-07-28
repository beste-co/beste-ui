"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes44Props {
  className?: string;
}

export const shapes44Demo: Shapes44Props = {};

export function Shapes44({ className }: Shapes44Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 items-center gap-2.5 rounded-md border border-border bg-card p-2.5 shadow-sm"
        aria-hidden="true"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground">
          <Play className="size-3 fill-background text-background" />
        </span>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="relative h-1 w-full rounded-full bg-muted">
            <span className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-foreground" />
          </div>
          <div className="flex items-center justify-between">
            <span className="h-1 w-6 rounded-full bg-muted" />
            <span className="h-1 w-6 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
