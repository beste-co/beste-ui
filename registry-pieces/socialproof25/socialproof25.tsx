"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Socialproof25Props {
  value?: number;
  max?: number;
  caption?: string;
  className?: string;
}

export const socialproof25Demo: Socialproof25Props = {
  value: 4.9,
  max: 5,
  caption: "from 240 verified clinics",
};

export function Socialproof25({
  value = 0,
  max = 5,
  caption,
  className,
}: Socialproof25Props) {
  const filled = Math.round(value);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-72 rounded-md border border-border bg-card p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-semibold tracking-tight text-card-foreground">
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
          <p className="mt-2 text-sm text-muted-foreground">{caption}</p>
        )}
      </div>
    </div>
  );
}
