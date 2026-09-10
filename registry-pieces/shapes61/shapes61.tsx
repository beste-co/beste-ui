"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes61Props {
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

export const shapes61Demo: Shapes61Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Shapes61({ surface = "card", bordered = true, inverted = false, className }: Shapes61Props) {
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
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Mail className="size-3.5 shrink-0 text-current/60" />
          <div className="flex flex-1 flex-col gap-1">
            <span className="h-1 w-10 rounded-full bg-current/10" />
            <span className="h-1.5 w-20 rounded-full bg-current/70" />
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Phone className="size-3.5 shrink-0 text-current/60" />
          <div className="flex flex-1 flex-col gap-1">
            <span className="h-1 w-10 rounded-full bg-current/10" />
            <span className="h-1.5 w-16 rounded-full bg-current/70" />
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <MapPin className="size-3.5 shrink-0 text-current/60" />
          <div className="flex flex-1 flex-col gap-1">
            <span className="h-1 w-10 rounded-full bg-current/10" />
            <span className="h-1.5 w-24 rounded-full bg-current/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
