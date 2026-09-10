"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes49Props {
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

export const shapes49Demo: Shapes49Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes49({ surface = "card", bordered = true, inverted = false, className }: Shapes49Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="grid h-32 w-48 grid-cols-3 grid-rows-3 gap-1.5"
        aria-hidden="true"
      >
        <div className={cn("col-span-2 row-span-2 flex flex-col gap-1.5 rounded-md p-2", surfaceTone, bordered && "border border-current/15")}>
          <span className="size-4 rounded-sm bg-current/70" />
          <span className="mt-auto h-1 w-3/4 rounded-full bg-current/70" />
          <span className="h-1 w-1/2 rounded-full bg-current/10" />
        </div>
        <div className="flex flex-col gap-1 rounded-md border border-current/15 bg-current/10 p-1.5">
          <span className="size-2.5 rounded-sm bg-current/70" />
          <span className="mt-auto h-1 w-2/3 rounded-full bg-current/10" />
        </div>
        <div className="flex flex-col gap-1 rounded-md border border-current/15 bg-current/10 p-1.5">
          <span className="size-2.5 rounded-sm bg-current/70" />
          <span className="mt-auto h-1 w-3/4 rounded-full bg-current/10" />
        </div>
        <div className="col-span-3 flex items-center gap-2 rounded-md border border-current/15 bg-current/10 p-2">
          <span className="size-3 shrink-0 rounded-sm bg-current/70" />
          <span className="h-1 w-1/3 rounded-full bg-current/70" />
          <span className="ml-auto h-1 w-8 rounded-full bg-current/10" />
        </div>
      </div>
    </div>
  );
}
