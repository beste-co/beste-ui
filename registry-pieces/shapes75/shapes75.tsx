"use client";

import { Play, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes75Props {
  className?: string;
}

export const shapes75Demo: Shapes75Props = {};

export function Shapes75({ className }: Shapes75Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-48 items-center gap-2.5 rounded-md border border-border bg-card p-2.5 shadow-sm"
        aria-hidden="true"
      >
        <span className="size-10 shrink-0 rounded-sm bg-muted" />
        <div className="flex flex-1 flex-col gap-1">
          <span className="h-1.5 w-3/4 rounded-full bg-foreground/70" />
          <span className="h-1 w-1/2 rounded-full bg-muted" />
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <SkipBack className="size-3 fill-muted-foreground text-muted-foreground" />
          <span className="flex size-7 items-center justify-center rounded-full bg-foreground">
            <Play className="size-3 fill-background text-background" />
          </span>
          <SkipForward className="size-3 fill-muted-foreground text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
