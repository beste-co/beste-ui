"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Progress13Props {
  distribution?: number[];
  className?: string;
}

export const progress13Demo: Progress13Props = {
  distribution: [68, 22, 6, 3, 1],
};

export function Progress13({
  distribution = [0, 0, 0, 0, 0],
  className,
}: Progress13Props) {
  const bars = distribution.slice(0, 5);
  while (bars.length < 5) bars.push(0);
  const max = Math.max(...bars, 1);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-1">
        {bars.map((value, i) => {
          const stars = 5 - i;
          const pct = (value / max) * 100;
          return (
            <div
              key={stars}
              className="flex items-center gap-2"
            >
              <div className="flex w-10 shrink-0 items-center gap-0.5 text-xs font-semibold tabular-nums text-muted-foreground">
                {stars}
                <Star
                  className="size-3 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
              </div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all"
                  style={{ width: `${pct}%` }}
                  aria-hidden="true"
                />
              </div>
              <span className="w-8 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {value}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
