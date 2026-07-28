"use client";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sunset"
  | "ocean"
  | "forest"
  | "midnight";

interface Media4Props {
  src?: string;
  alt?: string;
  title?: string;
  artist?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-400",
  ocean: "bg-gradient-to-br from-sky-500 to-indigo-600",
  forest: "bg-gradient-to-br from-emerald-600 to-teal-400",
  midnight: "bg-gradient-to-br from-indigo-900 to-slate-900",
};

export const media4Demo: Media4Props = {
  src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&fit=crop",
  alt: "Soft lit studio",
  title: "Night Drive",
  artist: "Lumen",
  tone: "midnight",
};

export function Media4({
  src,
  alt,
  title,
  artist,
  tone = "sunset",
  className,
}: Media4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-32 flex-col gap-2">
        <div
          className={cn(
            "relative aspect-square w-full overflow-hidden rounded-md border border-border shadow-lg shadow-black/20",
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
        </div>
        <div className="flex flex-col gap-0.5">
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
      </div>
    </div>
  );
}
