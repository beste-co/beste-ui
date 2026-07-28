"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toolbar2Props {
  playing?: boolean;
  className?: string;
}

export const toolbar2Demo: Toolbar2Props = {
  playing: true,
};

export function Toolbar2({ playing = false, className }: Toolbar2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm">
        <button
          type="button"
          aria-label="Previous track"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <SkipBack className="size-4 fill-current" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          aria-pressed={playing}
          className="flex size-10 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition-colors hover:bg-foreground/90"
        >
          {playing ? (
            <Pause className="size-4 fill-current" aria-hidden="true" />
          ) : (
            <Play
              className="size-4 translate-x-px fill-current"
              aria-hidden="true"
            />
          )}
        </button>
        <button
          type="button"
          aria-label="Next track"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <SkipForward className="size-4 fill-current" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
