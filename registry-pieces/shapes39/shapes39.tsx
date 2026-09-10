"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes39Props {
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

export const shapes39Demo: Shapes39Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes39({ surface = "card", bordered = true, inverted = false, className }: Shapes39Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-48 gap-2.5 rounded-md p-2 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <span className="h-16 w-14 shrink-0 rounded-sm bg-current/10" />
        <div className="flex flex-1 flex-col gap-1.5 py-1">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span className="h-1 w-10 rounded-full bg-current/10" />
          </div>
          <span className="h-1.5 w-full rounded-full bg-current/70" />
          <span className="h-1.5 w-3/4 rounded-full bg-current/70" />
          <span className="h-1 w-1/2 rounded-full bg-current/10" />
        </div>
      </div>
    </div>
  );
}
