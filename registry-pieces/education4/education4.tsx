"use client";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education4Props {
  title?: string;
  duration?: string;
  chapter?: string;
  watched?: number;
  imageSrc?: string;
  alt?: string;
  className?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1558865869-c93f6f8482af?auto=format&fit=crop&w=640&q=80";

export const education4Demo: Education4Props = {
  title: "Refactoring a big list into virtualized rows",
  duration: "12:48",
  chapter: "Chapter 4 · Performance",
  watched: 40,
  imageSrc: defaultImage,
  alt: "Refactoring a big list · lesson",
};

export function Education4({
  title,
  duration,
  chapter,
  watched = 0,
  imageSrc = defaultImage,
  alt,
  className,
}: Education4Props) {
  const pct = Math.max(0, Math.min(100, watched));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={imageSrc}
            alt={alt ?? title ?? ""}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <div className="flex size-12 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg">
              <Play className="ml-0.5 size-5" aria-hidden="true" />
            </div>
          </div>
          {duration && (
            <span className="absolute bottom-2 right-2 rounded-md bg-background/80 px-2 py-0.5 font-mono text-xs text-card-foreground">
              {duration}
            </span>
          )}
          <div
            className="absolute inset-x-0 bottom-0 h-1 bg-black/40"
            aria-hidden="true"
          >
            <div
              className="h-full bg-rose-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-0.5 p-3">
          {chapter && (
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {chapter}
            </span>
          )}
          {title && (
            <span className="line-clamp-2 text-sm font-semibold leading-snug text-card-foreground">
              {title}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
