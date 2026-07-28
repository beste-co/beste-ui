"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload24Props {
  filename?: string;
  duration?: string;
  size?: string;
  thumbnailSrc?: string;
  className?: string;
}

const defaultThumbnail =
  "https://images.unsplash.com/photo-1776608721705-3a529722aea5?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1MXx8fGVufDB8fHx8fA%3D%3D";

export const upload24Demo: Upload24Props = {
  filename: "launch-teaser.mp4",
  duration: "0:42",
  size: "54 MB",
  thumbnailSrc: defaultThumbnail,
};

export function Upload24({
  filename,
  duration,
  size,
  thumbnailSrc = defaultThumbnail,
  className,
}: Upload24Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnailSrc}
            alt="Video Preview"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md">
              <Play className="ml-0.5 size-4" aria-hidden="true" />
            </div>
          </div>
          {duration && (
            <span className="absolute bottom-2 right-2 rounded-md bg-background/80 px-1.5 py-0.5 font-mono text-xs text-card-foreground">
              {duration}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between px-2.5 py-1.5 text-xs">
          <span className="truncate font-medium text-card-foreground">
            {filename}
          </span>
          <span className="shrink-0 text-muted-foreground">{size}</span>
        </div>
      </div>
    </div>
  );
}
