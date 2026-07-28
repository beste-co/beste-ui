"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes59Props {
  className?: string;
}

export const shapes59Demo: Shapes59Props = {};

export function Shapes59({ className }: Shapes59Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm"
        aria-hidden="true"
      >
        <div className="relative h-24 w-full bg-muted">
          <span className="absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground">
            <Play className="size-3 fill-background text-background" />
          </span>
        </div>
        <div className="flex items-center gap-2 p-2.5">
          <span className="size-6 shrink-0 rounded-full bg-muted" />
          <div className="flex flex-1 flex-col gap-1">
            <span className="h-1.5 w-14 rounded-full bg-foreground/70" />
            <span className="h-1 w-10 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
