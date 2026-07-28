"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky";

interface Media21Props {
  duration?: string;
  bars?: number[];
  progress?: number;
  tone?: Tone;
  className?: string;
}

const bubbleClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
};

export const media21Demo: Media21Props = {
  duration: "0:14",
  progress: 35,
  tone: "primary",
  bars: [
    30, 55, 40, 70, 90, 60, 45, 80, 65, 50, 35, 60, 95, 75, 40, 55, 70, 45, 60,
    85, 50, 30, 65, 40,
  ],
};

export function Media21({
  duration,
  bars = [],
  progress = 0,
  tone = "primary",
  className,
}: Media21Props) {
  const [playing, setPlaying] = useState(false);
  const clamped = Math.max(0, Math.min(100, progress));
  const playedCount = Math.round((clamped / 100) * bars.length);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-56 items-center gap-3 rounded-2xl rounded-br-sm px-3 py-2.5 shadow-sm",
          bubbleClasses[tone]
        )}
      >
        <button
          type="button"
          onClick={() => setPlaying((prev) => !prev)}
          aria-label={playing ? "Pause" : "Play"}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/20 text-current transition-colors hover:bg-white/30"
        >
          {playing ? (
            <Pause className="size-4 fill-current" />
          ) : (
            <Play className="size-4 fill-current" />
          )}
        </button>

        <div className="flex h-6 flex-1 items-center gap-0.5" aria-hidden="true">
          {bars.map((height, i) => (
            <span
              key={i}
              className={cn(
                "w-0.5 shrink-0 rounded-full",
                i < playedCount ? "bg-current" : "bg-current/40"
              )}
              style={{ height: `${Math.max(15, Math.min(100, height))}%` }}
            />
          ))}
        </div>

        {duration && (
          <span className="shrink-0 text-xs font-medium tabular-nums opacity-80">
            {duration}
          </span>
        )}
      </div>
    </div>
  );
}
