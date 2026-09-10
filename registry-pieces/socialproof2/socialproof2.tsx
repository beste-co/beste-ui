"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Socialproof2Props {
  rating?: number;
  reviewCount?: string;
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

export const socialproof2Demo: Socialproof2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  rating: 4.8,
  reviewCount: "2,847",
};

export function Socialproof2({
  rating = 0,
  reviewCount,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Socialproof2Props) {
  const fullStars = Math.floor(rating);
  const partialFill = rating % 1;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => {
            const isFull = i < fullStars;
            const isPartial = i === fullStars && partialFill > 0;

            if (isFull) {
              return (
                <Star
                  key={i}
                  className="size-3.5 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
              );
            }

            if (isPartial) {
              return (
                <div key={i} className="relative">
                  <Star
                    className="size-3.5 fill-muted text-muted"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${partialFill * 100}%` }}
                  >
                    <Star
                      className="size-3.5 fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              );
            }

            return (
              <Star
                key={i}
                className="size-3.5 fill-muted text-muted"
                aria-hidden="true"
              />
            );
          })}
        </div>
        <span className="text-xs font-semibold">
          {rating.toFixed(1)}
        </span>
        {reviewCount && (
          <span className="text-xs text-current/60">
            ({reviewCount})
          </span>
        )}
      </div>
    </div>
  );
}
