"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes33Props {
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

export const shapes33Demo: Shapes33Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes33({ surface = "card", bordered = true, inverted = false, className }: Shapes33Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-40 flex-col gap-2.5 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <span className="h-1 w-12 rounded-full bg-current/10" />
        <div className="flex items-baseline gap-1">
          <span className="h-5 w-12 rounded-sm bg-current" />
          <span className="h-1 w-6 rounded-full bg-current/10" />
        </div>
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Check className="size-3 text-emerald-500" />
              <span className="h-1 w-20 rounded-full bg-current/10" />
            </div>
          ))}
        </div>
        <span className="h-5 w-full rounded-sm bg-current" />
      </div>
    </div>
  );
}
