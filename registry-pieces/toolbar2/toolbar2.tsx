"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Toolbar2Props {
  playing?: boolean;
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

export const toolbar2Demo: Toolbar2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  playing: true,
};

export function Toolbar2({ playing = false, surface = "card", bordered = true, inverted = false, className }: Toolbar2Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-1 rounded-full p-1 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <button
          type="button"
          aria-label="Previous track"
          className="flex size-8 items-center justify-center rounded-full text-current/60 transition-colors hover:bg-current/10 hover:text-current"
        >
          <SkipBack className="size-4 fill-current" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          aria-pressed={playing}
          className="flex size-10 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition-colors hover:bg-current/90"
        >
          {playing ? (
            <Pause className="size-4 fill-current" aria-hidden="true" />
          ) : (
            <Play
              className="size-4 translate-x-px fill-current"
              aria-hidden="true"
            />
          )}
        </button>
        <button
          type="button"
          aria-label="Next track"
          className="flex size-8 items-center justify-center rounded-full text-current/60 transition-colors hover:bg-current/10 hover:text-current"
        >
          <SkipForward className="size-4 fill-current" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
