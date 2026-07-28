"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Socialproof2Props {
  rating?: number;
  reviewCount?: string;
  className?: string;
}

export const socialproof2Demo: Socialproof2Props = {
  rating: 4.8,
  reviewCount: "2,847",
};

export function Socialproof2({
  rating = 0,
  reviewCount,
  className,
}: Socialproof2Props) {
  const fullStars = Math.floor(rating);
  const partialFill = rating % 1;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
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
        <span className="text-xs font-semibold text-card-foreground">
          {rating.toFixed(1)}
        </span>
        {reviewCount && (
          <span className="text-xs text-muted-foreground">
            ({reviewCount})
          </span>
        )}
      </div>
    </div>
  );
}
