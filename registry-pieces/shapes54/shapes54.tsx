"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes54Props {
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

export const shapes54Demo: Shapes54Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes54({ surface = "card", bordered = true, inverted = false, className }: Shapes54Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-48 items-center gap-2.5 rounded-md p-3", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <div className="flex flex-1 flex-col gap-1">
          <span className="h-1.5 w-3/4 rounded-full bg-current/70" />
          <span className="h-1 w-full rounded-full bg-current/10" />
        </div>
        <div className="flex shrink-0 gap-1.5">
          <span className="h-5 w-10 rounded-sm border border-current/15" />
          <span className="h-5 w-10 rounded-sm bg-current" />
        </div>
      </div>
    </div>
  );
}
