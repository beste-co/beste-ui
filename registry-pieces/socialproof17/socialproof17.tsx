"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Socialproof17Props {
  platform?: string;
  rating?: number;
  tag?: string;
  bordered?: boolean;
  className?: string;
}

export const socialproof17Demo: Socialproof17Props = {
  platform: "G2",
  rating: 4.8,
  tag: "Leader",
  bordered: false,
};

export function Socialproof17({
  platform = "Platform",
  rating = 0,
  tag,
  bordered = false,
  className,
}: Socialproof17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-2.5 rounded-md bg-card px-3 py-1.5 shadow-sm", bordered && "border border-border")}>
        <span className="text-sm font-bold text-card-foreground">
          {platform}
        </span>
        <div className="h-4 w-px bg-border" aria-hidden="true" />
        <div className="flex items-center gap-1">
          <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
          <span className="text-sm font-semibold tabular-nums text-card-foreground">
            {rating.toFixed(1)}
          </span>
        </div>
        {tag && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            {tag}
          </span>
        )}
      </div>
    </div>
  );
}
