"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Thumbnail {
  src: string;
  alt: string;
}

interface Media25Props {
  thumbnail?: Thumbnail;
  title?: string;
  meta?: string;
  duration?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const media25Demo: Media25Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  thumbnail: {
    src: "https://images.unsplash.com/photo-1678380003465-e8b1b9e3877c?q=80&w=2228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "A small team talking around a laptop",
  },
  title: "A day inside the workspace",
  meta: "Product tour",
  duration: "2:48",
};

export function Media25({ thumbnail, title, meta, duration, surface = "card", bordered = true, inverted = false, className }: Media25Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-80 overflow-hidden rounded-md shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div className="relative h-32 w-full overflow-hidden bg-current/10">
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
            <p className="text-xs text-current/60">{meta}</p>
          )}
          {title && (
            <p className="mt-1 text-sm font-medium">{title}</p>
          )}
        </div>
      </div>
    </div>
  );
}
