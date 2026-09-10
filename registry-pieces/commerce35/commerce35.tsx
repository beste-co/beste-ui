"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type ProductStatus = "published" | "draft" | "archived";

interface ProductRow {
  title: string;
  price: string;
  variants?: number;
  status?: ProductStatus;
}

interface Commerce35Props {
  title?: string;
  products?: ProductRow[];
  variantsWord?: string;
  stepMs?: number;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const dotClasses: Record<ProductStatus, string> = {
  published: "bg-emerald-500",
  draft: "bg-amber-500",
  archived: "bg-current/40",
};

const statusLabel: Record<ProductStatus, string> = {
  published: "Published",
  draft: "Draft",
  archived: "Archived",
};


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const commerce35Demo: Commerce35Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Products",
  products: [
    { title: "Field Jacket", price: "£180", variants: 8, status: "published" },
    { title: "Waxed Tote", price: "£95", variants: 3, status: "published" },
    { title: "Wool Scarf", price: "£45", status: "draft" },
  ],
  variantsWord: "variants",
  stepMs: 440,
};

const STYLES = `
@keyframes commerce35-in { from { opacity: 0; transform: translateY(0.375rem); } to { opacity: 1; transform: none; } }
.commerce35-in { animation: commerce35-in 320ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .commerce35-in { animation: none; } }
`;

export function Commerce35({
  title,
  products = [],
  variantsWord = "variants",
  stepMs = 440,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Commerce35Props) {
  const [landed, setLanded] = useState(0);

  useEffect(() => {
    if (landed >= products.length) return;
    const id = setTimeout(() => setLanded((value) => value + 1), stepMs);
    return () => clearTimeout(id);
  }, [landed, products.length, stepMs]);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{STYLES}</style>

      <div
        className={cn(
          "flex w-full max-w-72 flex-col gap-3 rounded-xl p-4 shadow-sm",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-baseline justify-between gap-3">
          {title && (
            <span className="truncate text-sm font-semibold">
              {title}
            </span>
          )}
          <span className="shrink-0 text-xl font-light leading-none tabular-nums">
            {landed}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {products.map((product, index) => {
            const status = product.status ?? "published";
            const shown = index < landed;

            return (
              <div
                key={product.title}
                className={cn(
                  "flex items-center gap-2.5",
                  shown ? "commerce35-in" : "invisible"
                )}
              >
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-md bg-current/10"
                  aria-hidden="true"
                >
                  <Package className="size-3.5 text-current/60" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        dotClasses[status]
                      )}
                      aria-label={statusLabel[status]}
                    />
                    <span className="truncate text-xs font-medium">
                      {product.title}
                    </span>
                  </div>
                  <p className="truncate text-xs text-current/60">
                    {product.price}
                    {product.variants
                      ? ` · ${product.variants} ${variantsWord}`
                      : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
