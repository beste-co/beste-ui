"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Socialproof20Props {
  rating?: number;
  outOf?: number;
  caption?: string;
  className?: string;
}

export const socialproof20Demo: Socialproof20Props = {
  rating: 4.9,
  outOf: 5,
  caption: "From 2,400+ reviews",
};

export function Socialproof20({
  rating = 0,
  outOf = 5,
  caption,
  className,
}: Socialproof20Props) {
  const rounded = Math.round(rating);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={cn(
                "size-5",
                i <= rounded
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              )}
              aria-hidden="true"
            />
          ))}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold leading-none tabular-nums text-card-foreground">
            {rating.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">out of {outOf}</span>
        </div>
        {caption && (
          <span className="text-sm text-muted-foreground">{caption}</span>
        )}
      </div>
    </div>
  );
}
