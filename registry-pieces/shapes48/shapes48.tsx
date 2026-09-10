"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes48Props {
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

export const shapes48Demo: Shapes48Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes48({ surface = "card", bordered = true, inverted = false, className }: Shapes48Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-44 flex-col items-center gap-2" aria-hidden="true">
        <div className={cn("flex h-4 items-center gap-1.5 rounded-full px-2", surfaceTone, bordered && "border border-current/15")}>
          <span className="size-1 rounded-full bg-emerald-500" />
          <span className="h-1 w-8 rounded-full bg-current/10" />
        </div>
        <span className="h-2.5 w-2/3 rounded-full bg-current/70" />
        <span className="h-2.5 w-1/2 rounded-full bg-current/70" />
        <span className="h-1 w-3/4 rounded-full bg-current/10" />
        <span className="mt-1 h-4 w-14 rounded-sm bg-current" />
      </div>
    </div>
  );
}
