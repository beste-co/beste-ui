"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes34Props {
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

export const shapes34Demo: Shapes34Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes34({ surface = "card", bordered = true, inverted = false, className }: Shapes34Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-44 flex-col gap-1.5" aria-hidden="true">
        <div className={cn("flex flex-col gap-2 rounded-md px-3 py-2", surfaceTone, bordered && "border border-current/15")}>
          <div className="flex items-center justify-between gap-2">
            <span className="h-1.5 w-24 rounded-full bg-current/70" />
            <ChevronDown className="size-3 rotate-180 text-current/60" />
          </div>
          <span className="h-1 w-full rounded-full bg-current/10" />
          <span className="h-1 w-3/4 rounded-full bg-current/10" />
        </div>
        <div className="flex items-center justify-between gap-2 rounded-md border border-current/15 bg-current/10 px-3 py-2">
          <span className="h-1.5 w-20 rounded-full bg-current/10" />
          <ChevronDown className="size-3 text-current/60" />
        </div>
        <div className="flex items-center justify-between gap-2 rounded-md border border-current/15 bg-current/10 px-3 py-2">
          <span className="h-1.5 w-28 rounded-full bg-current/10" />
          <ChevronDown className="size-3 text-current/60" />
        </div>
      </div>
    </div>
  );
}
