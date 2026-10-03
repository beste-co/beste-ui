"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Socialproof8Props {
  platform?: string;
  score?: number;
  total?: string;
  distribution?: number[];
  bordered?: boolean;
  className?: string;
}

export const socialproof8Demo: Socialproof8Props = {
  platform: "Trustpilot",
  score: 4.8,
  total: "2,341 reviews",
  distribution: [82, 12, 3, 1, 2],
  bordered: false,
};

export function Socialproof8({
  platform,
  score = 0,
  total,
  distribution = [],
  bordered = false,
  className,
}: Socialproof8Props) {
  const rows = [distribution[0] ?? 0, distribution[1] ?? 0, distribution[2] ?? 0, distribution[3] ?? 0, distribution[4] ?? 0];
  const rounded = Math.round(score);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-3 rounded-lg bg-card p-4 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums text-card-foreground">
              {score.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">/ 5</span>
          </div>
          {platform && (
            <span className="text-xs font-semibold text-muted-foreground">
              {platform}
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={cn(
                "size-4",
                i <= rounded
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              )}
              aria-hidden="true"
            />
          ))}
          {total && (
            <span className="ml-2 text-xs text-muted-foreground">
              {total}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {rows.map((pct, i) => {
            const starLevel = 5 - i;
            return (
              <div
                key={starLevel}
                className="flex items-center gap-2 text-xs"
              >
                <span className="w-2 shrink-0 text-right tabular-nums text-muted-foreground">
                  {starLevel}
                </span>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${pct}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
