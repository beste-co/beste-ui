"use client";

import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface Commerce25Line {
  qty: number;
  name: string;
  price: string;
}

interface Commerce25Props {
  storeName?: string;
  orderId?: string;
  lines?: Commerce25Line[];
  subtotal?: string;
  total?: string;
  paid?: string;
  className?: string;
}

export const commerce25Demo: Commerce25Props = {
  storeName: "Beste Goods · SF",
  orderId: "INV-2026-0421",
  lines: [
    { qty: 2, name: "Air Max 90", price: "$258.00" },
    { qty: 1, name: "Cotton Tee", price: "$48.00" },
    { qty: 1, name: "Retro Shades", price: "$38.00" },
  ],
  subtotal: "$344.00",
  total: "$368.14",
  paid: "Visa ending 4242",
};

export function Commerce25({
  storeName = "Store",
  orderId,
  lines = [],
  subtotal,
  total = "$0.00",
  paid,
  className,
}: Commerce25Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-md border border-dashed border-border bg-card p-3 font-mono shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Receipt
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-card-foreground">
              {storeName}
            </span>
          </div>
          {orderId && (
            <span className="text-xs text-muted-foreground">{orderId}</span>
          )}
        </div>
        <div className="flex flex-col gap-0.5 border-y border-dashed border-border py-2">
          {lines.map((l, i) => (
            <div
              key={i}
              className="flex items-baseline justify-between gap-2 text-xs"
            >
              <span className="text-muted-foreground">
                {l.qty}× <span className="text-card-foreground">{l.name}</span>
              </span>
              <span className="tabular-nums text-card-foreground">
                {l.price}
              </span>
            </div>
          ))}
        </div>
        {subtotal && (
          <div className="flex items-baseline justify-between text-xs text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums">{subtotal}</span>
          </div>
        )}
        <div className="flex items-baseline justify-between border-t border-dashed border-border pt-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-card-foreground">
            Total
          </span>
          <span className="text-base font-semibold tabular-nums text-card-foreground">
            {total}
          </span>
        </div>
        {paid && (
          <span className="text-xs text-muted-foreground">Paid · {paid}</span>
        )}
      </div>
    </div>
  );
}
