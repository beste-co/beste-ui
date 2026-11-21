"use client";

import { cn } from "@/lib/utils";

interface Commerce46Product {
  name: string;
  price: string;
  /** Whether it stays lit once the filter is on */
  match?: boolean;
  /** The price tag in the accent color */
  featured?: boolean;
}

interface Commerce46Props {
  filterLabel?: string;
  allLabel?: string;
  filteredLabel?: string;
  /** A bottle, a jar and a tube, left to right */
  products?: [Commerce46Product, Commerce46Product, Commerce46Product];
  className?: string;
}

export const commerce46Demo: Commerce46Props = {
  filterLabel: "Filter",
  allLabel: "All products",
  filteredLabel: "Sensitive skin",
  products: [
    { name: "Serum", price: "€42", match: false },
    { name: "Cream", price: "€38", match: true, featured: true },
    { name: "Gel", price: "€24", match: true },
  ],
};

const STYLES = `
@keyframes commerce46-a { 0%, 32% { opacity: 1; } 39%, 92% { opacity: 0; } 98%, 100% { opacity: 1; } }
@keyframes commerce46-b { 0%, 41% { opacity: 0; transform: translateY(0.375rem); } 50%, 84% { opacity: 1; transform: none; } 91%, 100% { opacity: 0; transform: translateY(0.375rem); } }
@keyframes commerce46-dim { 0%, 36% { opacity: 1; } 46%, 86% { opacity: 0.28; } 96%, 100% { opacity: 1; } }
.commerce46-a { animation: commerce46-a 12s ease -7s infinite; }
.commerce46-b { opacity: 0; animation: commerce46-b 12s cubic-bezier(.3,0,.2,1) -7s infinite; }
.commerce46-dim { animation: commerce46-dim 12s ease -7s infinite; }
@media (prefers-reduced-motion: reduce) {
  .commerce46-a, .commerce46-b, .commerce46-dim { animation: none; }
  .commerce46-a { opacity: 0; }
  .commerce46-b { opacity: 1; }
  .commerce46-dim { opacity: 0.28; }
}
`;

const SHAPE = "fill-card stroke-muted-foreground/40";
const BAND = "fill-muted";
const CENTERS = [72, 133, 197];

function Shape({ index, name }: { index: number; name: string }) {
  if (index === 0) {
    return (
      <g>
        <rect x="58" y="54" width="28" height="44" rx="6" className={SHAPE} />
        <rect x="59" y="68" width="26" height="16" className={BAND} />
        <rect x="65" y="46" width="14" height="8" className={SHAPE} />
        <rect x="64.5" y="30" width="15" height="16" rx="7" className={SHAPE} />
        <text x="72" y="79" textAnchor="middle" fontSize="8" className="fill-muted-foreground">{name}</text>
      </g>
    );
  }
  if (index === 1) {
    return (
      <g>
        <rect x="108" y="68" width="50" height="30" rx="7" className={SHAPE} />
        <rect x="109" y="78" width="48" height="11" className={BAND} />
        <rect x="105" y="58" width="56" height="10" rx="3" className={SHAPE} />
        <text x="133" y="86" textAnchor="middle" fontSize="8" className="fill-muted-foreground">{name}</text>
      </g>
    );
  }
  return (
    <g>
      <path d="M184 32 H210 L207 84 H187 Z" className={SHAPE} />
      <line x1="184.5" y1="38" x2="209.5" y2="38" className="stroke-border" />
      <rect x="186" y="84" width="22" height="14" rx="3" className={SHAPE} />
      <text x="197" y="64" textAnchor="middle" fontSize="8" className="fill-muted-foreground">{name}</text>
    </g>
  );
}

export function Commerce46({ filterLabel, allLabel, filteredLabel, products, className }: Commerce46Props) {
  const items = products ?? [];
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 264 124" fill="none" className="h-auto w-full max-w-66 overflow-visible" aria-hidden="true">
        <text x="22" y="14" fontSize="9.5" className="fill-muted-foreground">{filterLabel}</text>
        <text x="70" y="14" fontSize="11" className="commerce46-a fill-foreground/80">{allLabel}</text>
        <text x="70" y="14" fontSize="11" className="commerce46-b fill-chart-1">{filteredLabel}</text>
        <line x1="22" y1="22" x2="242" y2="22" className="stroke-border" />

        {items.map((product, index) => (
          <g key={index} className={cn(product.match === false && "commerce46-dim")}>
            <Shape index={index} name={product.name} />
          </g>
        ))}

        <rect x="30" y="102" width="208" height="3" className="fill-foreground/5" />
        <rect x="26" y="98" width="216" height="5" rx="1.5" className={SHAPE} />
        <path d="M52 103 V112 M216 103 V112" className="stroke-muted-foreground/40" />

        {items.map((product, index) => {
          const x = CENTERS[index] ?? 0;
          return (
            <g key={index} className={cn(product.match === false && "commerce46-dim")}>
              <line x1={x} y1="103" x2={x} y2="108" className="stroke-muted-foreground/40" />
              <rect x={x - 13} y="108" width="26" height="13" rx="2.5" className={SHAPE} />
              <text x={x} y="117" textAnchor="middle" fontSize="8" className={product.featured ? "fill-chart-1" : "fill-muted-foreground"}>
                {product.price}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
