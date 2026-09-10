"use client";

import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes79Props {
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

export const shapes79Demo: Shapes79Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes79({ surface = "card", bordered = true, inverted = false, className }: Shapes79Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-44 flex-col items-center gap-2 rounded-md p-4", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <Inbox className="size-8 text-current/30" />
        <div className="flex flex-col items-center gap-1">
          <span className="h-1.5 w-24 rounded-full bg-current/70" />
          <span className="h-1 w-32 rounded-full bg-current/10" />
        </div>
        <span className="mt-1 h-5 w-16 rounded-sm bg-current" />
      </div>
    </div>
  );
}
