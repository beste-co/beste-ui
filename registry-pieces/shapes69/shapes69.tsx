"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes69Props {
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

export const shapes69Demo: Shapes69Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes69({ surface = "card", bordered = true, inverted = false, className }: Shapes69Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-48 flex-col items-center gap-2.5 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <span className="h-1.5 w-24 rounded-full bg-current/70" />
        <span className="h-1 w-32 rounded-full bg-current/10" />
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md border border-current/15 bg-background text-foreground">
            <span className="h-2.5 w-1 rounded-full bg-current/70" />
          </span>
          <span className="flex size-8 items-center justify-center rounded-md border border-current/15 bg-background text-foreground">
            <span className="h-2.5 w-1 rounded-full bg-current/70" />
          </span>
          <span className="size-8 rounded-md border-2 border-foreground bg-background text-foreground" />
          <span className="size-8 rounded-md border border-current/15 bg-background text-foreground" />
        </div>
        <span className="mt-1 h-6 w-full rounded-sm bg-current" />
      </div>
    </div>
  );
}
