"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes36Props {
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

export const shapes36Demo: Shapes36Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes36({ surface = "card", bordered = true, inverted = false, className }: Shapes36Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-48 items-center gap-3 rounded-md p-2 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <span className="size-4 shrink-0 rounded-sm bg-current" />
        <div className="flex flex-1 items-center gap-2.5">
          <span className="h-1 w-6 rounded-full bg-current/10" />
          <span className="h-1 w-8 rounded-full bg-current/10" />
          <span className="h-1 w-5 rounded-full bg-current/10" />
        </div>
        <span className="h-4 w-10 shrink-0 rounded-sm bg-current" />
      </div>
    </div>
  );
}
