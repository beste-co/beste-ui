"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes70Props {
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

export const shapes70Demo: Shapes70Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes70({ surface = "card", bordered = true, inverted = false, className }: Shapes70Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-48 grid-cols-3 items-stretch gap-1.5" aria-hidden="true">
        <div className={cn("flex flex-col gap-1 rounded-md p-2", surfaceTone, bordered && "border border-current/15")}>
          <span className="h-1 w-8 rounded-full bg-current/10" />
          <span className="h-3 w-10 rounded-sm bg-current/70" />
          <span className="mt-1 h-px w-full bg-border" />
          <span className="h-1 w-3/4 rounded-full bg-current/10" />
          <span className="h-1 w-2/3 rounded-full bg-current/10" />
        </div>
        <div className="flex flex-col gap-1 rounded-md border-2 border-foreground bg-current/10 p-2">
          <span className="h-1 w-8 rounded-full bg-current/70" />
          <span className="h-3 w-10 rounded-sm bg-current" />
          <span className="mt-1 h-px w-full bg-border" />
          <span className="h-1 w-3/4 rounded-full bg-current/10" />
          <span className="h-1 w-2/3 rounded-full bg-current/10" />
        </div>
        <div className="flex flex-col gap-1 rounded-md border border-current/15 bg-current/10 p-2">
          <span className="h-1 w-8 rounded-full bg-current/10" />
          <span className="h-3 w-10 rounded-sm bg-current/70" />
          <span className="mt-1 h-px w-full bg-border" />
          <span className="h-1 w-3/4 rounded-full bg-current/10" />
          <span className="h-1 w-2/3 rounded-full bg-current/10" />
        </div>
      </div>
    </div>
  );
}
