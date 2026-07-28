"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "sunset" | "ocean";

interface Media2Props {
  src?: string;
  alt?: string;
  duration?: string;
  title?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-gradient-to-br from-primary/40 to-primary",
  foreground: "bg-gradient-to-br from-foreground/40 to-foreground",
  sunset: "bg-gradient-to-br from-rose-400 to-orange-500",
  ocean: "bg-gradient-to-br from-sky-400 to-indigo-600",
};

export const media2Demo: Media2Props = {
  src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&fit=crop",
  alt: "Sunlight through a forest canopy",
  duration: "2:48",
  title: "Product tour",
  tone: "ocean",
};

export function Media2({
  src,
  alt,
  duration,
  title,
  tone = "primary",
  className,
}: Media2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "relative aspect-video w-full max-w-64 overflow-hidden rounded-lg border border-border shadow-sm",
          !src && toneClasses[tone]
        )}
      >
        {src && (
          <img
            src={src}
            alt={alt ?? ""}
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-card-foreground shadow-md">
            <Play className="size-4 fill-current" aria-hidden="true" />
          </span>
        </div>
        {duration && (
          <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 font-mono text-xs tabular-nums text-white">
            {duration}
          </span>
        )}
        {title && (
          <span className="absolute bottom-2 left-2 max-w-40 truncate rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
            {title}
          </span>
        )}
      </div>
    </div>
  );
}
