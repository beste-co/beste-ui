"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Socialproof25Props {
  value?: number;
  max?: number;
  caption?: string;
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

export const socialproof25Demo: Socialproof25Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  value: 4.9,
  max: 5,
  caption: "from 240 verified clinics",
};

export function Socialproof25({
  value = 0,
  max = 5,
  caption,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Socialproof25Props) {
  const filled = Math.round(value);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-72 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-semibold tracking-tight">
            {value.toFixed(1)}
          </span>
          <div className="flex gap-0.5" aria-hidden="true">
            {Array.from({ length: max }, (_, index) => (
              <Star
                key={index}
                className={cn(
                  "size-4",
                  index < filled
                    ? "fill-amber-500 text-amber-500"
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
        </div>
        {caption && (
          <p className="mt-2 text-sm text-current/60">{caption}</p>
        )}
      </div>
    </div>
  );
}
