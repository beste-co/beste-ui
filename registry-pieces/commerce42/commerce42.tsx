"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Commerce42Product {
  image: string;
  name: string;
  price?: string;
}

interface Commerce42Props {
  title?: string;
  /** The shop's name beside the title */
  store?: string;
  /** Filter chips; the first starts picked */
  filters?: string[];
  products?: Commerce42Product[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const commerce42Demo: Commerce42Props = {
  title: "Shop",
  filters: ["All", "Skincare", "Treatments", "Sensitive skin"],
  products: [
    { image: "https://oud.pics/b/beste/oriel-serum.webp", name: "Calming serum", price: "€42" },
    { image: "https://oud.pics/b/beste/oriel-ritual.webp", name: "Barrier cream", price: "€38" },
    { image: "https://oud.pics/b/beste/oriel-facial.webp", name: "Signature facial", price: "€85" },
    { image: "https://oud.pics/b/beste/oriel-consultation.webp", name: "Skin consultation", price: "€40" },
  ],
  framed: true,
};

export function Commerce42({ title, store, filters = [], products = [], framed = true, fill = false, className }: Commerce42Props) {
  const [picked, setPicked] = useState(0);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-215",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-4.5 rounded-2xl bg-stone-50 p-4 text-stone-900 md:p-6.5", !framed && "shadow-lg")}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              {title && <span className="text-xl font-medium tracking-tight">{title}</span>}
              {store && <span className="text-xs text-stone-500">{store}</span>}
            </div>
            {filters.length > 0 && (
              <div className="flex flex-wrap gap-1.5 text-xs">
                {filters.map((filter, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-pressed={picked === index}
                    onClick={() => setPicked(index)}
                    className={cn(
                      "cursor-pointer rounded-full px-3 py-1.5 transition-colors",
                      picked === index ? "bg-stone-900 text-stone-50" : "ring-1 ring-stone-200 hover:bg-stone-100",
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>
          {products.length > 0 && (
            <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
              {products.map((product, index) => (
                <div key={index} className="flex min-w-0 flex-col gap-2">
                  <img src={product.image} alt="" aria-hidden="true" className="aspect-4/5 w-full rounded-lg bg-stone-200 object-cover" />
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="truncate">{product.name}</span>
                    {product.price && <span className="shrink-0 text-stone-500">{product.price}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
