"use client";

import { cn } from "@/lib/utils";

interface Commerce44Variant {
  image?: string;
  label: string;
  price?: string;
  stock?: string;
}

interface Commerce44Props {
  title?: string;
  /** A quiet count beside the title */
  count?: string;
  /** The option the variants come from, with its values as pills */
  option?: { label: string; values: string[] };
  variants?: Commerce44Variant[];
  /** A quiet line at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const commerce44Demo: Commerce44Props = {
  title: "Barrier cream",
  option: { label: "Size", values: ["30 ml", "50 ml", "100 ml"] },
  variants: [
    { image: "https://oud.pics/b/beste/oriel-ritual.webp", label: "30 ml", price: "€24", stock: "12 left" },
    { image: "https://oud.pics/b/beste/oriel-ritual.webp", label: "50 ml", price: "€38", stock: "20 left" },
    { image: "https://oud.pics/b/beste/oriel-ritual.webp", label: "100 ml", price: "€62", stock: "6 left" },
  ],
  framed: true,
};

export function Commerce44({ title, count, option, variants = [], note, framed = true, fill = false, className }: Commerce44Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-75",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-sm font-semibold">{title}</span>
            {count && <span className="shrink-0 text-muted-foreground">{count}</span>}
          </div>
          {option && (
            <div className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
              {option.label}
              {option.values.map((value, index) => (
                <span key={index} className="rounded-full bg-muted px-2 py-0.5 text-foreground/75">
                  {value}
                </span>
              ))}
            </div>
          )}
          {variants.length > 0 && (
            <div className="flex flex-col border-t border-border">
              {variants.map((variant, index) => (
                <div key={index} className="flex items-center gap-2.5 border-b border-border py-2">
                  {variant.image && <img src={variant.image} alt="" aria-hidden="true" className="size-7.5 shrink-0 rounded-md bg-muted object-cover" />}
                  <span className="flex-1 truncate">{variant.label}</span>
                  {variant.price && <span className="text-muted-foreground">{variant.price}</span>}
                  {variant.stock && <span className="w-11 text-right text-muted-foreground/70">{variant.stock}</span>}
                </div>
              ))}
            </div>
          )}
          {note && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
