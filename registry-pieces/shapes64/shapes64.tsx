"use client";

import { Github, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes64Props {
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

export const shapes64Demo: Shapes64Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

const ICONS = [Twitter, Github, Linkedin, Youtube, Instagram];

export function Shapes64({ surface = "card", bordered = true, inverted = false, className }: Shapes64Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        {ICONS.map((Icon, i) => (
          <span
            key={i}
            className={cn("flex size-8 items-center justify-center rounded-full", surfaceTone, bordered && "border border-current/15")}
          >
            <Icon className="size-3.5 text-foreground/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
