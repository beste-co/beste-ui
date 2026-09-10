"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes43Props {
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

export const shapes43Demo: Shapes43Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes43({ surface = "card", bordered = true, inverted = false, className }: Shapes43Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-44 flex-col divide-y divide-border rounded-md", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="h-1.5 w-16 rounded-full bg-current/70" />
          <div className="relative h-3.5 w-7 rounded-full bg-emerald-500">
            <span className="absolute right-0.5 top-0.5 size-2.5 rounded-full bg-current/10" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="h-1.5 w-20 rounded-full bg-current/70" />
          <div className="relative h-3.5 w-7 rounded-full bg-current/10">
            <span className="absolute left-0.5 top-0.5 size-2.5 rounded-full bg-current/10" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="h-1.5 w-12 rounded-full bg-current/70" />
          <span className="h-1 w-10 rounded-full bg-current/10" />
        </div>
      </div>
    </div>
  );
}
