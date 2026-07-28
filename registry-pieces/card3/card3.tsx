"use client";

import { cn } from "@/lib/utils";

interface Card3Props {
  price?: string;
  originalPrice?: string;
  currency?: string;
  discount?: number;
  className?: string;
}

export const card3Demo: Card3Props = {
  price: "49",
  originalPrice: "89",
  currency: "$",
  discount: 45,
};

export function Card3({
  price,
  originalPrice,
  currency = "$",
  discount,
  className,
}: Card3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 shadow-sm">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">
            {currency}
          </span>
          <span className="text-2xl font-bold tabular-nums text-card-foreground">
            {price}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {currency}
              {originalPrice}
            </span>
          )}
        </div>
        {typeof discount === "number" && (
          <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            −{discount}%
          </span>
        )}
      </div>
    </div>
  );
}
