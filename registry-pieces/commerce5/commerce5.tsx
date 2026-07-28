"use client";

import { cn } from "@/lib/utils";

interface Commerce5Props {
  name?: string;
  sale?: string;
  original?: string;
  offPercent?: number;
  endsIn?: string;
  className?: string;
}

export const commerce5Demo: Commerce5Props = {
  name: "Cashmere Crewneck",
  sale: "$189",
  original: "$260",
  offPercent: 27,
  endsIn: "Sale ends in 2d 4h",
};

export function Commerce5({
  name = "Product",
  sale = "$0",
  original,
  offPercent,
  endsIn,
  className,
}: Commerce5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-1 rounded-md border border-border bg-card p-3 shadow-sm">
        <span className="truncate text-xs font-medium text-card-foreground">
          {name}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xl font-semibold tabular-nums text-rose-600 dark:text-rose-400">
            {sale}
          </span>
          {original && (
            <span className="font-mono text-sm tabular-nums text-muted-foreground line-through">
              {original}
            </span>
          )}
          {typeof offPercent === "number" && (
            <span className="inline-flex items-center rounded-sm bg-rose-500 px-1.5 py-0.5 text-xs font-bold text-white">
              −{offPercent}%
            </span>
          )}
        </div>
        {endsIn && (
          <span className="text-xs text-muted-foreground">{endsIn}</span>
        )}
      </div>
    </div>
  );
}
