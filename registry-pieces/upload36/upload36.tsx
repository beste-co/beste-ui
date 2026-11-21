"use client";

import { cn } from "@/lib/utils";

interface Upload36Props {
  /** Up to three tags that hang off the case one after another, e.g. what you can take with you */
  tags?: string[];
  className?: string;
}

export const upload36Demo: Upload36Props = {
  tags: ["pages.md", "images/", "orielstudio.pt"],
};

const STYLES = `
@keyframes upload36-tag0 { 0%, 6% { opacity: 0; transform: translateY(-10px) rotate(-8deg) } 14%, 86% { opacity: 1; transform: none } 94%, 100% { opacity: 0; transform: none } }
@keyframes upload36-tag1 { 0%, 16% { opacity: 0; transform: translateY(-10px) rotate(-8deg) } 24%, 86% { opacity: 1; transform: none } 94%, 100% { opacity: 0; transform: none } }
@keyframes upload36-tag2 { 0%, 26% { opacity: 0; transform: translateY(-10px) rotate(-8deg) } 34%, 86% { opacity: 1; transform: none } 94%, 100% { opacity: 0; transform: none } }
.upload36-tag0, .upload36-tag1, .upload36-tag2 { opacity: 0; transform-box: fill-box; transform-origin: 0 0; animation: upload36-tag0 13s cubic-bezier(.3,0,.2,1) infinite }
.upload36-tag1 { animation-name: upload36-tag1 } .upload36-tag2 { animation-name: upload36-tag2 }
@media (prefers-reduced-motion: reduce) { .upload36-tag0, .upload36-tag1, .upload36-tag2 { animation: none; opacity: 1; transform: none } }
`;

const SLOTS = [
  { x: 150, y: 103, string: "M124 66 C138 70 146 90 148 112" },
  { x: 160, y: 127, string: "M124 66 C146 68 156 100 158 136" },
  { x: 170, y: 151, string: "M124 66 C152 64 166 110 168 160" },
];

export function Upload36({ tags = [], className }: Upload36Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 240 210" aria-hidden="true" className="w-full max-w-60 overflow-visible">
        <ellipse cx="104" cy="194" rx="78" ry="5" className="fill-foreground/5" />
        <path d="M84 74 V60 a8 8 0 0 1 8 -8 h24 a8 8 0 0 1 8 8 V74" fill="none" strokeWidth="5" strokeLinecap="round" className="stroke-border" />
        <path d="M84 74 V60 a8 8 0 0 1 8 -8 h24 a8 8 0 0 1 8 8 V74" fill="none" strokeWidth="3" strokeLinecap="round" className="stroke-card" />
        <rect x="40.5" y="72.5" width="127" height="113" rx="13" className="fill-card stroke-border" />
        <rect x="41" y="73" width="126" height="11" rx="5.5" className="fill-muted/60" />
        <line x1="40" y1="96" x2="168" y2="96" className="stroke-border" />
        <line x1="68" y1="96" x2="68" y2="186" className="stroke-border/60" />
        <line x1="140" y1="96" x2="140" y2="186" className="stroke-border/60" />
        <rect x="60.5" y="90.5" width="15" height="10" rx="2.5" className="fill-background stroke-border" />
        <rect x="132.5" y="90.5" width="15" height="10" rx="2.5" className="fill-background stroke-border" />
        {tags.slice(0, 3).map((tag, index) => {
          const slot = SLOTS[index];
          if (!slot) return null;
          const width = Math.round(tag.length * 4.4 + 10);
          return (
            <g key={index}>
              <path d={slot.string} fill="none" strokeDasharray="1.5 1.5" className="stroke-muted-foreground/40" />
              <g transform={`translate(${slot.x} ${slot.y})`}>
                <g className={`upload36-tag${index}`}>
                  <path d={`M0 0 L${width} 0 L${width} 18 L0 18 L-8 9 Z`} strokeLinejoin="round" className="fill-card stroke-border" />
                  <circle cx="-2" cy="9" r="2" className="fill-background stroke-muted-foreground/40" />
                  <text x="5" y="12" fontSize="8" className="fill-foreground/80">
                    {tag}
                  </text>
                </g>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
