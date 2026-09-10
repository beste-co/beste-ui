"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes71Props {
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

export const shapes71Demo: Shapes71Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes71({ surface = "card", bordered = true, inverted = false, className }: Shapes71Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-48 items-center gap-2" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn("flex flex-1 flex-col items-center gap-1 rounded-md p-2", surfaceTone, bordered && "border border-current/15")}
          >
            <span className="h-3 w-7 rounded-sm bg-current/70" />
            <span className="h-1 w-5 rounded-full bg-current/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
