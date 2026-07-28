"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Socialproof13Props {
  rating?: number;
  count?: string;
  className?: string;
}

export const socialproof13Demo: Socialproof13Props = {
  rating: 4.9,
  count: "2,847",
};

export function Socialproof13({
  rating = 0,
  count,
  className,
}: Socialproof13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-1">
        <div
          className="flex items-center gap-0.5"
          aria-hidden="true"
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="size-4 fill-amber-400 text-amber-400"
            />
          ))}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold tabular-nums text-card-foreground">
            {rating.toFixed(1)}
          </span>
          {count && (
            <span className="text-xs text-muted-foreground">
              from {count} reviews
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
