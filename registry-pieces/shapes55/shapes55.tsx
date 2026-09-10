"use client";

import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes55Props {
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

export const shapes55Demo: Shapes55Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes55({ surface = "card", bordered = true, inverted = false, className }: Shapes55Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-44 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <Quote className="size-5 fill-foreground/20 text-foreground/20" />
        <span className="h-1.5 w-full rounded-full bg-current/10" />
        <span className="h-1.5 w-5/6 rounded-full bg-current/10" />
        <span className="h-1.5 w-2/3 rounded-full bg-current/10" />
        <div className="mt-1 flex flex-col gap-1">
          <span className="h-1.5 w-14 rounded-full bg-current/70" />
          <span className="h-1 w-10 rounded-full bg-current/10" />
        </div>
      </div>
    </div>
  );
}
