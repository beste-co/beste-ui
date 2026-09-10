"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes56Props {
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

export const shapes56Demo: Shapes56Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes56({ surface = "card", bordered = true, inverted = false, className }: Shapes56Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-44 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="h-1.5 w-full rounded-full bg-current/10" />
        <span className="h-1.5 w-3/4 rounded-full bg-current/10" />
        <div className="mt-1 flex items-center gap-2">
          <span className="size-6 shrink-0 rounded-full bg-current/10" />
          <div className="flex flex-1 flex-col gap-1">
            <span className="h-1.5 w-12 rounded-full bg-current/70" />
            <span className="h-1 w-8 rounded-full bg-current/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
