"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface Commerce37Product {
  image?: string;
  name?: string;
  added?: boolean;
}

interface Commerce37QuoteItem {
  name?: string;
  quantity?: number;
}

interface Commerce37Quote {
  title?: string;
  /** `{count}` is replaced with the number of items */
  countLabel?: string;
  countLabelOne?: string;
  items?: Commerce37QuoteItem[];
  button?: string;
}

interface Commerce37Props {
  filters?: string[];
  activeFilter?: number;
  products?: Commerce37Product[];
  addedLabel?: string;
  addLabel?: string;
  quote?: Commerce37Quote;
  className?: string;
}

export const commerce37Demo: Commerce37Props = {
  filters: ["All", "Serums", "Creams", "Gifts"],
  activeFilter: 0,
  products: [
    { image: "https://oud.pics/b/beste/oriel-serum.webp", name: "Barrier serum", added: true },
    { image: "https://oud.pics/b/beste/oriel-ritual.webp", name: "Night cream", added: true },
    { image: "https://oud.pics/b/beste/oriel-consultation.webp", name: "Gift card", added: false },
  ],
  addedLabel: "Added ✓",
  addLabel: "Add to quote",
  quote: {
    title: "Quote list",
    items: [
      { name: "Barrier serum", quantity: 24 },
      { name: "Night cream", quantity: 12 },
    ],
    button: "Request a quote",
  },
};

export function Commerce37({
  filters = [],
  activeFilter = 0,
  products = [],
  addedLabel,
  addLabel,
  quote,
  className,
}: Commerce37Props) {
  // Toggles are keyed by product name so they survive reordering
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const isAdded = (product: Commerce37Product) => toggled[product.name ?? ""] ?? Boolean(product.added);
  const toggle = (product: Commerce37Product) =>
    setToggled((current) => ({ ...current, [product.name ?? ""]: !(current[product.name ?? ""] ?? Boolean(product.added)) }));

  // Added products show their quoted quantity when the quote lists one, else 1
  const quoteItems = products
    .filter((product) => isAdded(product))
    .map((product) => ({
      name: product.name,
      quantity: quote?.items?.find((item) => item.name === product.name)?.quantity ?? 1,
    }));
  const count = quoteItems.length;
  const countText = count === 1 && quote?.countLabelOne ? quote.countLabelOne : quote?.countLabel?.replace("{count}", String(count));

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="relative mr-2.5 mb-7 w-full max-w-md">
        <div className="flex flex-col gap-2.5 rounded-2xl bg-stone-50 p-3.5 text-stone-800 shadow-lg">
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-1.5 text-xs">
              {filters.map((filter, i) => (
                <span
                  key={i}
                  className={cn(
                    "rounded-full px-2.5 py-1",
                    i === activeFilter ? "bg-stone-800 text-stone-50" : "bg-stone-200 text-stone-700",
                  )}
                >
                  {filter}
                </span>
              ))}
            </div>
          )}
          <div className="grid grid-cols-3 gap-2">
            {products.map((product, i) => {
              const on = isAdded(product);
              return (
                <div key={i} className="flex min-w-0 flex-col gap-1.5 text-xs">
                  {product.image && <img src={product.image} alt="" aria-hidden className="aspect-square w-full rounded-md object-cover" />}
                  <span className="truncate">{product.name}</span>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(product)}
                    className={cn(
                      "cursor-pointer truncate rounded-full border border-stone-800 px-1 py-1 text-center transition-colors",
                      on ? "bg-transparent text-stone-800" : "bg-stone-800 text-stone-50",
                    )}
                  >
                    {on ? addedLabel : addLabel}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {quote && (
          <div className="absolute -right-2.5 -bottom-7 flex w-52 flex-col gap-2 rounded-2xl bg-card p-3 text-xs text-card-foreground shadow-lg">
            <div className="flex justify-between text-sm font-semibold">
              {quote.title}
              {countText && <span className="font-normal text-muted-foreground">{countText}</span>}
            </div>
            {quoteItems.map((item, i) => (
              <div key={i} className="flex justify-between gap-2 text-muted-foreground">
                <span className="truncate">{item.name}</span>
                <span className="shrink-0 tabular-nums">× {item.quantity}</span>
              </div>
            ))}
            {quote.button && (
              <span className="rounded-full bg-primary py-1.5 text-center text-primary-foreground">{quote.button}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
