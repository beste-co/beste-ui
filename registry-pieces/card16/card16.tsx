"use client";

import { Tag, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card16Props {
  name?: string;
  original?: string;
  sale?: string;
  discount?: string;
  ends?: string;
  className?: string;
}

export const card16Demo: Card16Props = {
  name: "Lifetime license",
  original: "$299",
  sale: "$149",
  discount: "50% off",
  ends: "Ends in 2d 14h",
};

export function Card16({
  name,
  original,
  sale,
  discount,
  ends,
  className,
}: Card16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-xl border border-rose-500/50 bg-gradient-to-br from-rose-500/10 via-orange-500/10 to-amber-500/10 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
            <Tag className="size-3" aria-hidden="true" />
            {discount}
          </span>
          {ends && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <Timer className="size-3" aria-hidden="true" />
              {ends}
            </span>
          )}
        </div>
        {name && (
          <span className="text-sm font-semibold text-card-foreground">
            {name}
          </span>
        )}
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold text-card-foreground">
            {sale}
          </span>
          {original && (
            <span className="font-mono text-sm text-muted-foreground line-through">
              {original}
            </span>
          )}
        </div>
        <button
          type="button"
          className="mt-1 rounded-md bg-rose-500 px-3 py-2 text-xs font-semibold text-white shadow hover:opacity-90"
        >
          Claim the deal
        </button>
      </div>
    </div>
  );
}
