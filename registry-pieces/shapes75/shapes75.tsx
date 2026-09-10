"use client";

import { Play, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes75Props {
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

export const shapes75Demo: Shapes75Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes75({ surface = "card", bordered = true, inverted = false, className }: Shapes75Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-48 items-center gap-2.5 rounded-md p-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <span className="size-10 shrink-0 rounded-sm bg-current/10" />
        <div className="flex flex-1 flex-col gap-1">
          <span className="h-1.5 w-3/4 rounded-full bg-current/70" />
          <span className="h-1 w-1/2 rounded-full bg-current/10" />
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <SkipBack className="size-3 fill-muted-foreground text-current/60" />
          <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-background">
            <Play className="size-3 fill-background text-background" />
          </span>
          <SkipForward className="size-3 fill-muted-foreground text-current/60" />
        </div>
      </div>
    </div>
  );
}
