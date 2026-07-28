"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input23Props {
  label?: string;
  quantity?: number;
  max?: number;
  price?: string;
  className?: string;
}

export const input23Demo: Input23Props = {
  label: "Cabin upgrade",
  quantity: 2,
  max: 4,
  price: "$38 each",
};

export function Input23({
  label,
  quantity = 0,
  max = 10,
  price,
  className,
}: Input23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-semibold text-card-foreground">
              {label}
            </span>
          )}
          {price && (
            <span className="text-xs text-muted-foreground">{price}</span>
          )}
        </div>
        <div className="inline-flex items-center overflow-hidden rounded-full border border-border bg-card">
          <button
            type="button"
            disabled={quantity <= 0}
            className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
            aria-label="Decrease"
          >
            <Minus className="size-3.5" aria-hidden="true" />
          </button>
          <span className="flex min-w-10 items-center justify-center font-mono text-sm font-bold text-card-foreground">
            {quantity}
          </span>
          <button
            type="button"
            disabled={quantity >= max}
            className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
            aria-label="Increase"
          >
            <Plus className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
