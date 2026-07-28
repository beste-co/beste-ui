"use client";

import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Media13Props {
  iso?: string;
  shutter?: string;
  aperture?: string;
  className?: string;
}

export const media13Demo: Media13Props = {
  iso: "ISO 400",
  shutter: "1/250s",
  aperture: "f/2.8",
};

export function Media13({
  iso,
  shutter,
  aperture,
  className,
}: Media13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative aspect-video w-52 rounded-sm bg-zinc-950 shadow-xl shadow-black/30">
        <div
          className="absolute inset-2 grid grid-cols-3 grid-rows-3"
          aria-hidden="true"
        >
          {Array.from({ length: 9 }).map((_, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            return (
              <div
                key={i}
                className={cn(
                  "border-white/10",
                  col > 0 && "border-l",
                  row > 0 && "border-t"
                )}
              />
            );
          })}
        </div>
        {[
          "left-2 top-2 border-l-2 border-t-2",
          "right-2 top-2 border-r-2 border-t-2",
          "left-2 bottom-2 border-l-2 border-b-2",
          "right-2 bottom-2 border-r-2 border-b-2",
        ].map((pos) => (
          <span
            key={pos}
            className={cn("absolute size-4 border-white", pos)}
            aria-hidden="true"
          />
        ))}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Circle
            className="size-8 text-white/70"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
        <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-xs text-white/90">
          {iso && <span>{iso}</span>}
          {shutter && <span>{shutter}</span>}
          {aperture && <span>{aperture}</span>}
        </div>
        <div
          className="absolute left-1.5 top-1.5 flex items-center gap-1 text-xs font-bold text-rose-500"
          aria-hidden="true"
        >
          <span className="size-1.5 animate-pulse rounded-full bg-rose-500" />
          REC
        </div>
      </div>
    </div>
  );
}
