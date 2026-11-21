"use client";

import { cn } from "@/lib/utils";

interface Commerce38Props {
  journal?: { title?: string; lines?: string[] };
  product?: { brand?: string; size?: string };
  tag?: { name?: string; price?: string };
  className?: string;
}

export const commerce38Demo: Commerce38Props = {
  journal: { title: "Journal", lines: ["Winter", "skin notes"] },
  product: { brand: "Oriel" },
  tag: { name: "Calming serum", price: "€38" },
};

const STYLES = `
@keyframes commerce38-swing { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(4deg); } }
.commerce38-swing { transform-box: view-box; transform-origin: 178px 62px; animation: commerce38-swing 10s cubic-bezier(.45,0,.55,1) infinite; }
@media (prefers-reduced-motion: reduce) { .commerce38-swing { animation: none; } }
`;

function toLines(text: string, max = 9) {
  const lines: string[] = [];
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const last = lines[lines.length - 1];
    if (last && `${last} ${word}`.length <= max) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines.slice(0, 2);
}

export function Commerce38({ journal = {}, product = {}, tag = {}, className }: Commerce38Props) {
  const tagLines = toLines(tag.name ?? "");

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>

      <svg viewBox="0 0 240 150" className="h-auto w-60 overflow-visible" aria-hidden="true">
        <ellipse cx="120" cy="140" rx="84" ry="4" className="fill-foreground/5" />

        <g transform="rotate(-8 64 104)">
          <rect x="40" y="70" width="50" height="66" rx="3" className="fill-card stroke-border" />
          <line x1="45" y1="70" x2="45" y2="136" className="stroke-border" />
          <text x="51" y="86" fontSize="8" className="fill-muted-foreground">{journal.title}</text>
          <line x1="51" y1="92" x2="82" y2="92" className="stroke-border" strokeDasharray="2 2" />
          {(journal.lines ?? []).slice(0, 2).map((line, index) => (
            <text key={line} x="51" y={104 + index * 9} fontSize="7.5" fontWeight="500" className="fill-foreground">
              {line}
            </text>
          ))}
        </g>

        <rect x="112" y="16" width="16" height="26" rx="8" className="fill-chart-1" />
        <rect x="115" y="21" width="3" height="14" rx="1.5" className="fill-card" opacity="0.35" />
        <rect x="108" y="40" width="24" height="14" rx="2.5" className="fill-card stroke-border" />
        <line x1="108" y1="47" x2="132" y2="47" className="stroke-border" />
        <rect x="96" y="54" width="48" height="84" rx="9" className="fill-card stroke-border" />
        <rect x="102" y="62" width="5" height="68" rx="2.5" className="fill-muted" />
        <rect x="96" y="84" width="48" height="32" className="fill-card stroke-border" />
        <text x="120" y={product.size ? 98 : 103} textAnchor="middle" fontSize="8" fontWeight="500" className="fill-muted-foreground">{product.brand}</text>
        {product.size && <text x="120" y="109" textAnchor="middle" fontSize="8" className="fill-muted-foreground" opacity="0.8">{product.size}</text>}

        <path d="M131 50 C 150 46, 166 52, 178 62" fill="none" className="stroke-border" />

        <g className="commerce38-swing">
          <line x1="178" y1="62" x2="178" y2="68" className="stroke-border" />
          <rect x="168" y="64" width="40" height="54" rx="4" className="fill-card stroke-border" />
          <circle cx="178" cy="70" r="2.2" className="fill-muted stroke-border" />
          {tagLines.map((line, index) => (
            <text key={line} x="174" y={87 + index * 10} fontSize="8" className="fill-muted-foreground">
              {line}
            </text>
          ))}
          <text x="174" y="109" fontSize="10" fontWeight="600" className="fill-foreground">{tag.price}</text>
        </g>
      </svg>
    </div>
  );
}
