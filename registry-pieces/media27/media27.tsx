"use client";

import { useEffect, useState } from "react";
import { Pause, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface Media27Props {
  track?: string;
  artist?: string;
  cover?: string;
  durationSeconds?: number;
  cycleMs?: number;
  className?: string;
}

export const media27Demo: Media27Props = {
  track: "Ordinary People",
  artist: "Nina Simone",
  cover:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  durationSeconds: 214,
};

const PEAKS = [
  3, 5, 8, 6, 9, 12, 10, 7, 11, 14, 12, 9, 13, 16, 14, 11, 15, 12, 9, 13, 10,
  14, 16, 13, 9, 11, 8, 12, 9, 6, 8, 5,
];

const heightClasses: Record<number, string> = {
  3: "h-1",
  5: "h-1.5",
  6: "h-2",
  7: "h-2.5",
  8: "h-3",
  9: "h-3.5",
  10: "h-4",
  11: "h-5",
  12: "h-6",
  13: "h-7",
  14: "h-8",
  15: "h-9",
  16: "h-10",
};

function clock(total: number) {
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function Media27({
  track = "Untitled",
  artist = "Unknown artist",
  cover,
  durationSeconds = 200,
  cycleMs = 9000,
  className,
}: Media27Props) {
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    const tick = 90;
    const id = setInterval(() => {
      setRatio((r) => (r >= 1 ? 0 : Math.min(1, r + tick / cycleMs)));
    }, tick);
    return () => clearInterval(id);
  }, [cycleMs]);

  const playedBars = Math.round(ratio * PEAKS.length);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          {cover ? (
            <img
              src={cover}
              alt={`${track} cover`}
              className="size-10 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <span className="size-10 shrink-0 rounded-lg bg-muted" aria-hidden="true" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-card-foreground">
              {track}
            </p>
            <p className="truncate text-xs text-muted-foreground">{artist}</p>
          </div>
        </div>

        <div className="flex h-10 items-center justify-between gap-0.5" aria-hidden="true">
          {PEAKS.map((peak, i) => (
            <span
              key={i}
              className={cn(
                "w-1 rounded-full transition-colors duration-200 motion-reduce:transition-none",
                heightClasses[peak],
                i < playedBars ? "bg-foreground" : "bg-muted"
              )}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs tabular-nums text-muted-foreground">
          <span>{clock(durationSeconds * ratio)}</span>
          <span className="flex items-center gap-2">
            <button
              type="button"
              className="cursor-pointer text-muted-foreground transition-colors hover:text-card-foreground motion-reduce:transition-none"
              aria-label="Previous track"
            >
              <SkipBack className="size-4 fill-current" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90 motion-reduce:transition-none"
              aria-label="Pause"
            >
              <Pause className="size-4 fill-current" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="cursor-pointer text-muted-foreground transition-colors hover:text-card-foreground motion-reduce:transition-none"
              aria-label="Next track"
            >
              <SkipForward className="size-4 fill-current" aria-hidden="true" />
            </button>
          </span>
          <span>{clock(durationSeconds)}</span>
        </div>
      </div>
    </div>
  );
}
