"use client";

import { Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  name: string;
  /** Product photo shown as the row's thumbnail. */
  image?: string;
  price: string;
  rating?: string;
}

interface Search18Props {
  query?: string;
  products?: Product[];
  bordered?: boolean;
  className?: string;
}

export const search18Demo: Search18Props = {
  query: "linen",
  products: [
    {
      name: "Washed linen pillow",
      image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=120&h=120&fit=crop&auto=format&q=70",
      price: "$48",
    },
    {
      name: "Linen throw blanket",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=120&h=120&fit=crop&auto=format&q=70",
      price: "$112",
    },
    {
      name: "Striped linen cushion",
      image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=120&h=120&fit=crop&auto=format&q=70",
      price: "$34",
    },
  ],
  bordered: false,
};

export function Search18({
  query = "",
  products = [],
  bordered = false,
  className,
}: Search18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-xl bg-card shadow-md", bordered && "border border-border")}>
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
              {p.image ? (
                <img src={p.image} alt={p.name} loading="lazy" className="size-9 shrink-0 rounded-md bg-muted object-cover" />
              ) : (
                <div className="size-9 shrink-0 rounded-md bg-muted" aria-hidden="true" />
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-card-foreground">
                  {p.name}
                </span>
                {p.rating && (
                  <span className="inline-flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
                    <Star
                      className="size-3 fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                    {p.rating}
                  </span>
                )}
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-card-foreground">
                {p.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
