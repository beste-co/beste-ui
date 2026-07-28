"use client";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Media17Props {
  src?: string;
  alt?: string;
  title?: string;
  artist?: string;
  progress?: number;
  className?: string;
}

export const media17Demo: Media17Props = {
  src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&fit=crop",
  alt: "Album artwork",
  title: "Night Drive",
  artist: "Lumen",
  progress: 42,
};

export function Media17({
  src,
  alt,
  title,
  artist,
  progress = 0,
  className,
}: Media17Props) {
  const [playing, setPlaying] = useState(false);
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 items-center gap-3 rounded-lg border border-border bg-card p-2 shadow-sm">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
          {src && (
            <img
              src={src}
              alt={alt ?? ""}
              className="absolute inset-0 size-full object-cover"
            />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-col">
            {title && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {title}
              </span>
            )}
            {artist && (
              <span className="truncate text-xs text-muted-foreground">
                {artist}
              </span>
            )}
          </div>
          <div
            className="h-1 w-full overflow-hidden rounded-full bg-muted"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-foreground"
              style={{ width: `${clamped}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPlaying((prev) => !prev)}
          aria-label={playing ? "Pause" : "Play"}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
        >
          {playing ? (
            <Pause className="size-4 fill-current" />
          ) : (
            <Play className="size-4 fill-current" />
          )}
        </button>
      </div>
    </div>
  );
}
