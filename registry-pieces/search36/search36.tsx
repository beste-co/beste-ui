"use client";

import { cn } from "@/lib/utils";

interface Search36Props {
  /** The old path on the top sign, which fades once the redirect is in */
  from?: string;
  /** The new path that slides in under it */
  to?: string;
  /** The orange tag on the new sign */
  tag?: string;
  /** A path that stays as it is */
  other?: string;
  className?: string;
}

export const search36Demo: Search36Props = {
  from: "/our-team",
  to: "/about",
  tag: "301",
  other: "/journal",
};

const STYLES = `
@keyframes search36-new { 0%, 30% { opacity: 0; transform: translateX(-14px) } 42%, 86% { opacity: 1; transform: none } 96%, 100% { opacity: 0; transform: translateX(-14px) } }
@keyframes search36-old { 0%, 32% { opacity: 1 } 44%, 86% { opacity: 0.45 } 96%, 100% { opacity: 1 } }
.search36-new { opacity: 0; animation: search36-new 12s cubic-bezier(.45,0,.25,1) infinite }
.search36-old { animation: search36-old 12s ease infinite }
@media (prefers-reduced-motion: reduce) { .search36-new, .search36-old { animation: none } .search36-new { opacity: 1 } .search36-old { opacity: 0.45 } }
`;

function Board({ d, band, nail }: { d: string; band: { x: number; y: number; width: number }; nail: number }) {
  return (
    <>
      <path d={d} strokeLinejoin="round" className="fill-card stroke-border" />
      <rect x={band.x} y={band.y} width={band.width} height="7" rx="3" className="fill-background" />
      <circle cx="150" cy={nail} r="2.2" className="fill-card stroke-border" />
    </>
  );
}

export function Search36({ from, to, tag, other, className }: Search36Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 300 224" aria-hidden="true" className="w-full max-w-93 overflow-visible">
        <ellipse cx="150" cy="214" rx="74" ry="5" className="fill-foreground/5" />
        <rect x="144" y="28" width="12" height="184" rx="3" className="fill-card stroke-border" />
        <rect x="140" y="22" width="20" height="9" rx="3" className="fill-background stroke-border" />

        <Board d="M66 44 H221 Q225 44 225 48 V72 Q225 76 221 76 H66 L56 60 Z" band={{ x: 67, y: 45, width: 154 }} nail={60} />
        {from && (
          <text x="80" y="64" fontSize="10" className="search36-old fill-muted-foreground">
            {from}
          </text>
        )}

        <g className="search36-new">
          <Board d="M66 92 H221 Q225 92 225 96 V120 Q225 124 221 124 H66 L56 108 Z" band={{ x: 67, y: 93, width: 154 }} nail={108} />
          {to && (
            <text x="80" y="112" fontSize="10" className="fill-foreground">
              {to}
            </text>
          )}
          {tag && (
            <>
              <rect x="186" y="100" width="30" height="16" rx="3" className="fill-chart-1" />
              <text x="201" y="111.5" textAnchor="middle" fontSize="8.5" fontWeight="600" className="fill-white">
                {tag}
              </text>
            </>
          )}
        </g>

        <Board d="M81 142 H234 L244 158 L234 174 H81 Q77 174 77 170 V146 Q77 142 81 142 Z" band={{ x: 81, y: 143, width: 152 }} nail={158} />
        {other && (
          <text x="92" y="162" fontSize="10" className="fill-muted-foreground">
            {other}
          </text>
        )}
      </svg>
    </div>
  );
}
