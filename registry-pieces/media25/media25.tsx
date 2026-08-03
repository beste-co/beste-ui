"use client";

import { cn } from "@/lib/utils";

interface Thumbnail {
  src: string;
  alt: string;
}

interface Media25Props {
  thumbnail?: Thumbnail;
  title?: string;
  meta?: string;
  duration?: string;
  className?: string;
}

export const media25Demo: Media25Props = {
  thumbnail: {
    src: "https://images.unsplash.com/photo-1678380003465-e8b1b9e3877c?q=80&w=2228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "A small team talking around a laptop",
  },
  title: "A day inside the workspace",
  meta: "Product tour",
  duration: "2:48",
};

export function Media25({ thumbnail, title, meta, duration, className }: Media25Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-80 overflow-hidden rounded-md border border-border bg-card shadow-xl">
        <div className="relative h-32 w-full overflow-hidden bg-muted">
          {thumbnail && (
            <img
              className="absolute inset-0 size-full object-cover"
              src={thumbnail.src}
              alt={thumbnail.alt}
            />
          )}
          {duration && (
            <span className="absolute bottom-2 right-2 rounded-md bg-foreground/80 px-1.5 py-0.5 text-xs font-medium tabular-nums text-background">
              {duration}
            </span>
          )}
        </div>

        <div className="p-4">
          {meta && (
            <p className="text-xs text-muted-foreground">{meta}</p>
          )}
          {title && (
            <p className="mt-1 text-sm font-medium text-card-foreground">{title}</p>
          )}
        </div>
      </div>
    </div>
  );
}
