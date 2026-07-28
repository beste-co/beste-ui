"use client";

import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

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
  className?: string;
}

export const food5Demo: Food5Props = {
  restaurant: "Lokal · Modern Türk",
  items: [
    { qty: 2, name: "Meze plate", price: "₺320" },
    { qty: 1, name: "Roasted miso salmon", price: "₺240" },
    { qty: 1, name: "Pistachio baklava", price: "₺110" },
  ],
  subtotal: "₺670",
  delivery: "₺35",
  tip: "₺50",
  total: "₺755",
  subtotalLabel: "Subtotal",
  deliveryLabel: "Delivery",
  tipLabel: "Tip",
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
  className,
}: Food5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/15 text-amber-500">
            <Receipt className="size-3.5" aria-hidden="true" />
          </div>
          {restaurant && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {restaurant}
            </span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 text-xs"
            >
              <span className="flex-1 truncate text-card-foreground">
                <span className="font-mono text-muted-foreground">
                  {item.qty}×
                </span>{" "}
                {item.name}
              </span>
              <span className="font-mono text-card-foreground">
                {item.price}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 border-t border-dashed border-border pt-2 text-xs">
          {subtotal && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{subtotalLabel}</span>
              <span className="font-mono text-card-foreground">
                {subtotal}
              </span>
            </div>
          )}
          {delivery && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{deliveryLabel}</span>
              <span className="font-mono text-card-foreground">
                {delivery}
              </span>
            </div>
          )}
          {tip && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{tipLabel}</span>
              <span className="font-mono text-card-foreground">{tip}</span>
            </div>
          )}
        </div>
        <div className="flex items-baseline justify-between border-t border-border pt-2">
          <span className="text-sm font-semibold text-card-foreground">
            {totalLabel}
          </span>
          <span className="font-mono text-lg font-bold text-card-foreground">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}
