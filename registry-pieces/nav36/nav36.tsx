"use client";

import { cn } from "@/lib/utils";

interface Nav36Sign {
  label?: string;
  /** Text before the language segment, usually "/" */
  prefix?: string;
  /** Language segment, drawn in the accent colour */
  lang?: string;
  /** Rest of the path after the language, e.g. "/treatments" */
  slug?: string;
}

interface Nav36Props {
  /** Two signs: the first points right, the second left */
  signs?: Nav36Sign[];
  /** Small plate at the foot of the pole */
  tag?: string;
  className?: string;
}

export const nav36Demo: Nav36Props = {
  signs: [
    { label: "Treatments", prefix: "/", lang: "en", slug: "/treatments" },
    { label: "Tratamentos", prefix: "/", lang: "pt", slug: "/tratamentos" },
  ],
};

const STYLES = `
@keyframes nav36-sw1 { 0%, 100% { transform: rotate(-1.6deg); } 50% { transform: rotate(1.2deg); } }
@keyframes nav36-sw2 { 0%, 100% { transform: rotate(1.4deg); } 50% { transform: rotate(-1.4deg); } }
.nav36-sw1 { transform-box: view-box; transform-origin: 107px 34px; animation: nav36-sw1 10s cubic-bezier(.45,0,.55,1) infinite; }
.nav36-sw2 { transform-box: view-box; transform-origin: 107px 74px; animation: nav36-sw2 10s cubic-bezier(.45,0,.55,1) infinite; }
@media (prefers-reduced-motion: reduce) { .nav36-sw1, .nav36-sw2 { animation: none; } }
`;

function Path({ sign }: { sign: Nav36Sign }) {
  return (
    <>
      {sign.prefix}
      <tspan className="fill-chart-1">{sign.lang}</tspan>
      {sign.slug}
    </>
  );
}

export function Nav36({ signs = [], tag, className }: Nav36Props) {
  const [right, left] = signs;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>

      <svg viewBox="0 0 220 150" className="h-auto w-56 overflow-visible" aria-hidden="true">
        <ellipse cx="110" cy="142" rx="44" ry="3.5" className="fill-foreground/5" />
        <rect x="104" y="18" width="7" height="124" rx="2" className="fill-muted stroke-border" />
        <path d="M102 18 L107.5 11 L113 18 Z" strokeLinejoin="round" className="fill-muted stroke-border" />

        {right && (
          <g className="nav36-sw1">
            <path d="M111 24 L198 24 L210 37 L198 50 L111 50 Z" strokeLinejoin="round" className="fill-card stroke-border" />
            <circle cx="117" cy="37" r="1.6" fill="none" className="stroke-border" />
            <text x="124" y="35" fontSize="10" fontWeight="500" className="fill-foreground">{right.label}</text>
            <text x="124" y="45.5" fontSize="8" className="fill-muted-foreground">
              <Path sign={right} />
            </text>
          </g>
        )}

        {left && (
          <g className="nav36-sw2">
            <path d="M104 64 L22 64 L10 77 L22 90 L104 90 Z" strokeLinejoin="round" className="fill-card stroke-border" />
            <circle cx="98" cy="77" r="1.6" fill="none" className="stroke-border" />
            <text x="26" y="75" fontSize="10" fontWeight="500" className="fill-foreground">{left.label}</text>
            <text x="26" y="85.5" fontSize="8" className="fill-muted-foreground">
              <Path sign={left} />
            </text>
          </g>
        )}

        {tag && (
          <>
            <path d="M111 104 L150 104 L150 118 L111 118 Z" className="fill-card stroke-border" />
            <text x="117" y="113.8" fontSize="8" className="fill-muted-foreground">{tag}</text>
          </>
        )}
      </svg>
    </div>
  );
}
