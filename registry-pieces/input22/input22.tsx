"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input22Props {
  label?: string;
  rating?: number;
  hint?: string;
  className?: string;
}

export const input22Demo: Input22Props = {
  label: "How was your stay?",
  rating: 4,
  hint: "Tap to rate. Optional comment on the next step.",
};

export function Input22({
  label,
  rating = 0,
  hint,
  className,
}: Input22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2">
        {label && (
          <span className="text-sm font-semibold text-card-foreground">
            {label}
          </span>
        )}
        <div
          className="flex items-center gap-1"
          aria-label={`${rating} of 5`}
        >
          {Array.from({ length: 5 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={cn(
                "flex size-9 items-center justify-center rounded-md transition-colors",
                idx < rating
                  ? "bg-amber-500/15"
                  : "bg-muted"
              )}
              aria-label={`${idx + 1} stars`}
            >
              <Star
                className={cn(
                  "size-4",
                  idx < rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground"
                )}
                aria-hidden="true"
              />
            </button>
          ))}
          <span className="ml-2 font-mono text-sm font-semibold text-card-foreground">
            {rating}.0
          </span>
        </div>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}
