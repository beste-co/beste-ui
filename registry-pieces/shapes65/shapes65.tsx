"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes65Props {
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

export const shapes65Demo: Shapes65Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes65({ surface = "card", bordered = true, inverted = false, className }: Shapes65Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-44 flex-col gap-2.5 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <span className="mx-auto h-2 w-1/2 rounded-full bg-current/70" />
        <div className="flex flex-col gap-1 mt-1">
          <span className="h-1 w-10 rounded-full bg-current/10" />
          <span className="h-6 w-full rounded-sm border border-current/15 bg-background text-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="h-1 w-12 rounded-full bg-current/10" />
          <span className="h-6 w-full rounded-sm border border-current/15 bg-background text-foreground" />
        </div>
        <span className="h-6 w-full rounded-sm bg-current" />
      </div>
    </div>
  );
}
