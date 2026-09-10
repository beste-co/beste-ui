"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Card3Props {
  price?: string;
  originalPrice?: string;
  currency?: string;
  discount?: number;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const card3Demo: Card3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Card3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-3 rounded-xl px-4 py-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-medium text-current/60">
            {currency}
          </span>
          <span className="text-2xl font-bold tabular-nums">
            {price}
          </span>
          {originalPrice && (
            <span className="text-sm text-current/60 line-through">
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
