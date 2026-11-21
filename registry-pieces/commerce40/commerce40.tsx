"use client";

import { cn } from "@/lib/utils";

interface Commerce40Product {
  image: string;
  name: string;
  price?: string;
}

interface Commerce40Props {
  title?: string;
  count?: string;
  products?: Commerce40Product[];
  /** Two short facts on the ruled line at the foot */
  footer?: string[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const commerce40Demo: Commerce40Props = {
  title: "Shop",
  products: [
    { image: "https://oud.pics/b/beste/oriel-serum.webp", name: "Calm serum", price: "€38" },
    { image: "https://oud.pics/b/beste/oriel-ritual.webp", name: "Night cream", price: "€44" },
  ],
  framed: true,
};

export function Commerce40({ title, count, products = [], footer = [], framed = true, fill = false, className }: Commerce40Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-80",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 overflow-hidden rounded-2xl bg-card p-4 text-sm text-card-foreground", !framed && "ring-1 ring-border")}>
          {(title || count) && (
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold">{title}</span>
              {count && <span className="text-xs text-muted-foreground">{count}</span>}
            </div>
          )}
          {products.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5">
              {products.map((product, index) => (
                <div key={index} className="flex min-w-0 flex-col gap-1">
                  <img src={product.image} alt="" aria-hidden="true" className="mb-1 h-36 w-full rounded-lg bg-muted object-cover" />
                  <div className="truncate font-medium">{product.name}</div>
                  {product.price && <div className="text-xs text-muted-foreground">{product.price}</div>}
                </div>
              ))}
            </div>
          )}
          {footer.length > 0 && (
            <div className="mt-auto flex justify-between gap-3 border-t border-border pt-2.5 text-xs text-muted-foreground">
              {footer.map((item, index) => (
                <span key={index} className="truncate">{item}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
