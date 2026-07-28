"use client";

import { Mic, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sunset"
  | "ocean"
  | "violet"
  | "midnight";

interface Media8Props {
  src?: string;
  alt?: string;
  title?: string;
  host?: string;
  duration?: string;
  tone?: Tone;
  className?: string;
}

const coverClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-400",
  ocean: "bg-gradient-to-br from-sky-500 to-indigo-600",
  violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
  midnight: "bg-gradient-to-br from-indigo-900 to-slate-900",
};

const playClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  foreground: "bg-foreground text-background hover:bg-foreground/90",
  sunset: "bg-orange-500 text-white hover:bg-orange-600",
  ocean: "bg-sky-500 text-white hover:bg-sky-600",
  violet: "bg-violet-500 text-white hover:bg-violet-600",
  midnight: "bg-slate-900 text-white hover:bg-slate-800",
};

export const media8Demo: Media8Props = {
  src: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&fit=crop",
  alt: "Podcast cover art",
  title: "The Quiet Startup",
  host: "Ceren Yıldırım",
  duration: "48 min",
  tone: "violet",
};

export function Media8({
  src,
  alt,
  title,
  host,
  duration,
  tone = "ocean",
  className,
}: Media8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-lg border border-border bg-card p-2.5 shadow-sm">
        <div
          className={cn(
            "relative size-14 shrink-0 overflow-hidden rounded-md shadow-sm",
            !src && coverClasses[tone]
          )}
        >
          {src && (
            <img
              src={src}
              alt={alt ?? ""}
              className="absolute inset-0 size-full object-cover"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Mic className="size-5 text-white" aria-hidden="true" />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {title && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {title}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {host && <span className="truncate">{host}</span>}
            {host && duration && (
              <span className="size-1 shrink-0 rounded-full bg-muted-foreground/40" />
            )}
            {duration && (
              <span className="shrink-0 tabular-nums">{duration}</span>
            )}
          </div>
        </div>
        <button
          type="button"
          aria-label="Play episode"
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full shadow-sm transition-colors",
            playClasses[tone]
          )}
        >
          <Play
            className="size-3.5 translate-x-px fill-current"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
