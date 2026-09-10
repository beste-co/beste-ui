"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes41Props {
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

export const shapes41Demo: Shapes41Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes41({ surface = "card", bordered = true, inverted = false, className }: Shapes41Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-48 grid-cols-3 gap-1.5" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={cn("flex flex-col gap-1.5 rounded-md p-2", surfaceTone, bordered && "border border-current/15")}
          >
            <span className="h-1 w-8 rounded-full bg-current/10" />
            <span className="h-3 w-10 rounded-sm bg-current" />
          </div>
        ))}
      </div>
    </div>
  );
}
