"use client";

import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface OrderItem {
  qty: number;
  name: string;
  price: string;
}

interface Food5Props {
  restaurant?: string;
  items?: OrderItem[];
  subtotal?: string;
  delivery?: string;
  tip?: string;
  total?: string;
  subtotalLabel?: string;
  deliveryLabel?: string;
  tipLabel?: string;
  totalLabel?: string;
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

export const food5Demo: Food5Props = {
  surface: "card",
  bordered: false,
  inverted: false,
  restaurant: "Lokal",
  items: [
    { qty: 2, name: "Meze plate", price: "₺320" },
    { qty: 1, name: "Roasted miso salmon", price: "₺240" },
    { qty: 1, name: "Pistachio baklava", price: "₺110" },
  ],
  total: "₺670",
  totalLabel: "Total",
};

export function Food5({
  restaurant,
  items = [],
  subtotal,
  delivery,
  tip,
  total,
  subtotalLabel = "Subtotal",
  deliveryLabel = "Delivery",
  tipLabel = "Tip",
  totalLabel = "Total",
  surface = "card",
  bordered = false,
  inverted = false,
  className,
}: Food5Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-2">
          <Receipt className="size-4 shrink-0 text-amber-500" aria-hidden="true" />
          {restaurant && (
            <span className="text-xs font-semibold text-current/60">
              {restaurant}
            </span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 text-xs tabular-nums"
            >
              <span className="flex-1 truncate">
                <span className="text-current/60">
                  {item.qty}×
                </span>{" "}
                {item.name}
              </span>
              <span>
                {item.price}
              </span>
            </div>
          ))}
        </div>
        {(subtotal || delivery || tip) && (
          <div className="flex flex-col gap-1 border-t border-dashed border-current/15 pt-2 text-xs tabular-nums">
            {subtotal && (
              <div className="flex justify-between">
                <span className="text-current/60">{subtotalLabel}</span>
                <span>{subtotal}</span>
              </div>
            )}
            {delivery && (
              <div className="flex justify-between">
                <span className="text-current/60">{deliveryLabel}</span>
                <span>{delivery}</span>
              </div>
            )}
            {tip && (
              <div className="flex justify-between">
                <span className="text-current/60">{tipLabel}</span>
                <span>{tip}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex items-baseline justify-between border-t border-current/15 pt-2">
          <span className="text-sm font-semibold">
            {totalLabel}
          </span>
          <span className="text-lg font-bold tabular-nums">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}
