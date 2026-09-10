"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes45Props {
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

export const shapes45Demo: Shapes45Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes45({ surface = "card", bordered = true, inverted = false, className }: Shapes45Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-48 items-stretch gap-2.5 rounded-md p-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center justify-center gap-1 rounded-sm bg-foreground px-3 py-2 text-background">
          <span className="h-1 w-5 rounded-full bg-background/50 text-foreground" />
          <span className="h-3 w-6 rounded-sm bg-background text-foreground" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          <span className="h-1.5 w-full rounded-full bg-current/70" />
          <span className="h-1.5 w-3/4 rounded-full bg-current/70" />
          <div className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span className="h-1 w-12 rounded-full bg-current/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
