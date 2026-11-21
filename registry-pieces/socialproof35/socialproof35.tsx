"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface Socialproof35Quote {
  /** Lines as drawn, or one string that is wrapped into short lines */
  text: string | string[];
  author: string;
}

interface Socialproof35Props {
  quotes?: Socialproof35Quote[];
  intervalMs?: number;
  className?: string;
}

export const socialproof35Demo: Socialproof35Props = {
  quotes: [
    { text: ["Calm room,", "careful hands."], author: "Norah J. · Lisbon" },
    { text: ["Booked again", "the same week."], author: "Jacob C. · Porto" },
  ],
  intervalMs: 5000,
};

function toLines(text: string | string[], max = 15) {
  if (Array.isArray(text)) return text;
  const lines: string[] = [];
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const last = lines[lines.length - 1];
    if (last && `${last} ${word}`.length <= max) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines;
}

export function Socialproof35({ quotes = [], intervalMs = 5000, className }: Socialproof35Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (quotes.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((value) => (value + 1) % quotes.length), intervalMs);
    return () => clearInterval(id);
  }, [quotes.length, intervalMs]);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <svg viewBox="0 0 240 150" className="h-auto w-60 overflow-visible" aria-hidden="true">
        <ellipse cx="122" cy="141" rx="78" ry="4" className="fill-foreground/5" />
        <rect x="58" y="22" width="134" height="104" rx="6" className="fill-card stroke-border" transform="rotate(7 125 74)" />
        <rect x="54" y="22" width="134" height="104" rx="6" className="fill-card stroke-border" transform="rotate(-4 121 74)" />
        <rect x="52" y="26" width="138" height="106" rx="6" className="fill-card stroke-border" />
        <rect x="108" y="20" width="28" height="11" rx="1.5" className="fill-muted stroke-border" transform="rotate(-3 122 25)" />
        <line x1="66" y1="102" x2="176" y2="102" className="stroke-border" strokeDasharray="2 2" />

        <g className="text-chart-1">
          <circle cx="63.5" cy="54" r="3" fill="currentColor" />
          <circle cx="72.5" cy="54" r="3" fill="currentColor" />
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M60.6 54.2 C 60.4 50.2, 62.4 47.6, 66 46.6" />
            <path d="M69.6 54.2 C 69.4 50.2, 71.4 47.6, 75 46.6" />
          </g>
        </g>

        {quotes.map((quote, index) => (
          <g
            key={index}
            className={cn(
              "transition-opacity duration-700 motion-reduce:transition-none",
              index === active % Math.max(quotes.length, 1) ? "opacity-100" : "opacity-0"
            )}
          >
            {toLines(quote.text)
              .slice(0, 2)
              .map((line, lineIndex) => (
                <text key={line} x="66" y={74 + lineIndex * 16} fontSize="12.5" fontWeight="500" className="fill-foreground">
                  {line}
                </text>
              ))}
            <text x="66" y="116" fontSize="8" className="fill-muted-foreground">
              {quote.author}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
