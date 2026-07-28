"use client";

import { cn } from "@/lib/utils";

interface Line {
  description: string;
  qty: number;
  price: string;
  total: string;
}

interface Money7Props {
  number?: string;
  lines?: Line[];
  subtotal?: string;
  tax?: string;
  total?: string;
  className?: string;
}

export const money7Demo: Money7Props = {
  number: "INV-20481",
  lines: [
    { description: "Block license", qty: 2, price: "$49.00", total: "$98.00" },
    { description: "Support hours", qty: 4, price: "$35.00", total: "$140.00" },
  ],
  subtotal: "$238.00",
  tax: "$47.60",
  total: "$285.60",
};

export function Money7({
  number,
  lines = [],
  subtotal,
  tax,
  total,
  className,
}: Money7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border border-border bg-card px-3 py-3 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Invoice
          </span>
          {number && (
            <span className="font-mono text-xs text-card-foreground">
              #{number}
            </span>
          )}
        </div>
        <ul className="flex flex-col gap-1 border-t border-border pt-2 text-xs">
          {lines.map((line, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2"
            >
              <span className="flex-1 truncate text-card-foreground">
                {line.description}
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {line.qty} × {line.price}
              </span>
              <span className="w-16 shrink-0 text-right font-semibold tabular-nums text-card-foreground">
                {line.total}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-1 border-t border-border pt-2 text-xs">
          {subtotal && (
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">{subtotal}</span>
            </div>
          )}
          {tax && (
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Tax</span>
              <span className="tabular-nums">{tax}</span>
            </div>
          )}
          {total && (
            <div className="flex items-center justify-between text-sm font-bold">
              <span>Total</span>
              <span className="tabular-nums">{total}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
