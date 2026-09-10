"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes44Props {
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

export const shapes44Demo: Shapes44Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes44({ surface = "card", bordered = true, inverted = false, className }: Shapes44Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-44 items-center gap-2.5 rounded-md p-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <Play className="size-3 fill-background text-background" />
        </span>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="relative h-1 w-full rounded-full bg-current/10">
            <span className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-current" />
          </div>
          <div className="flex items-center justify-between">
            <span className="h-1 w-6 rounded-full bg-current/10" />
            <span className="h-1 w-6 rounded-full bg-current/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
