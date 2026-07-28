"use client";

import { ChevronLeft, ChevronRight, Maximize, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toolbar18Props {
  current?: number;
  total?: number;
  playing?: boolean;
  className?: string;
}

export const toolbar18Demo: Toolbar18Props = {
  current: 7,
  total: 24,
  playing: true,
};

export function Toolbar18({
  current = 1,
  total = 1,
  playing = false,
  className,
}: Toolbar18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1 rounded-full bg-zinc-900 p-1 text-zinc-100 shadow-md">
        <button
          type="button"
          aria-label="Previous slide"
          className="flex size-8 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-50 text-zinc-900 transition-colors hover:bg-zinc-200"
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
          aria-label="Next slide"
          className="flex size-8 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
        <div className="mx-1 h-5 w-px bg-zinc-800" aria-hidden="true" />
        <span className="px-2 font-mono text-xs tabular-nums text-zinc-300">
          {current} / {total}
        </span>
        <button
          type="button"
          aria-label="Enter fullscreen"
          className="flex size-8 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
        >
          <Maximize className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
