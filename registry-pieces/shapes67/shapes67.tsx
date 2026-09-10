"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes67Props {
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

export const shapes67Demo: Shapes67Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes67({ surface = "card", bordered = true, inverted = false, className }: Shapes67Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-48 flex-col gap-2" aria-hidden="true">
        <div className={cn("flex h-7 items-center gap-2 rounded-full px-3", surfaceTone, bordered && "border border-current/15")}>
          <Search className="size-3 text-current/60" />
          <span className="h-1 w-20 rounded-full bg-current/10" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="h-5 w-12 rounded-full bg-current/70" />
          <span className="h-5 w-14 rounded-full border border-current/15 bg-current/10" />
          <span className="h-5 w-10 rounded-full border border-current/15 bg-current/10" />
          <span className="h-5 w-12 rounded-full border border-current/15 bg-current/10" />
        </div>
      </div>
    </div>
  );
}
