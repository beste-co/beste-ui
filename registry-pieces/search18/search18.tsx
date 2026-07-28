"use client";

import { Package, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  name: string;
  price: string;
  rating: string;
}

interface Search18Props {
  query?: string;
  products?: Product[];
  className?: string;
}

export const search18Demo: Search18Props = {
  query: "linen",
  products: [
    { name: "Washed linen pillow", price: "$48", rating: "4.8" },
    { name: "Linen throw blanket", price: "$112", rating: "4.6" },
    { name: "Natural linen apron", price: "$34", rating: "4.9" },
  ],
};

export function Search18({
  query = "",
  products = [],
  className,
}: Search18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-md">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-card-foreground">
            {query}
          </span>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {products.map((p, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-3 py-2"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-amber-200 to-rose-200 text-amber-800">
                <Package className="size-4" aria-hidden="true" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-card-foreground">
                  {p.name}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Star
                    className="size-3 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                  {p.rating}
                </span>
              </div>
              <span className="shrink-0 font-mono text-sm font-semibold text-card-foreground">
                {p.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
