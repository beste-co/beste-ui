"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

interface Search31Props {
  /** The round photo on the badge */
  image?: string;
  /** Letter on the avatar when there is no image */
  initial?: string;
  name?: string;
  /** Entity type under the name */
  kind?: string;
  url?: string;
  /** Caption above the linked profiles */
  linksLabel?: string;
  /** Up to 4 profiles: the first 3 sit right of the badge, the 4th on the left */
  links?: string[];
  className?: string;
}

export const search31Demo: Search31Props = {
  image: "https://oud.pics/b/beste/oriel-facial.webp",
  name: "Oriel Skin Studio",
  url: "orielstudio.pt",
  links: ["Instagram", "Maps", "Press"],
};

const STYLES = `
@keyframes search31-tag { 0%, 6% { opacity: 0; transform: translateY(-0.375rem); } 16%, 86% { opacity: 1; transform: none; } 96%, 100% { opacity: 0; transform: translateY(-0.375rem); } }
.search31-tag { opacity: 0; animation: search31-tag 12s cubic-bezier(.3,0,.2,1) infinite; }
@media (prefers-reduced-motion: reduce) { .search31-tag { animation: none; opacity: 1; } }
`;

const SLOTS = [
  { y: 79, side: "right" },
  { y: 113, side: "right" },
  { y: 147, side: "right" },
  { y: 105, side: "left" },
] as const;

export function Search31({ image, initial, name, kind, url, linksLabel, links = [], className }: Search31Props) {
  const clip = `search31-avatar-${useId().replace(/:/g, "")}`;
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>

      <svg viewBox="-20 0 280 200" className="h-auto w-64 overflow-visible" aria-hidden="true">
        <ellipse cx="120" cy="190" rx="70" ry="4" className="fill-foreground/5" />
        <path d="M112 0 L118 32 M128 0 L122 32" className="stroke-border" />
        <rect x="110" y="28" width="20" height="22" rx="3" className="fill-muted stroke-border" />
        <rect x="70" y="46" width="100" height="134" rx="8" className="fill-card stroke-border" />
        <rect x="106" y="54" width="28" height="5" rx="2.5" className="fill-muted stroke-border" />
        <rect x="76" y="66" width="88" height="2" className="fill-muted" />
        {image ? (
          <>
            <clipPath id={clip}>
              <circle cx="120" cy="94" r="15" />
            </clipPath>
            <image href={image} x="105" y="79" width="30" height="30" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clip})`} />
          </>
        ) : (
          <>
            <circle cx="120" cy="94" r="15" className="fill-chart-1" />
            <text x="120" y="98.5" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-card">{initial}</text>
          </>
        )}
        <circle cx="120" cy="94" r="20" fill="none" className="stroke-chart-1" strokeOpacity="0.2" />
        <text x="120" y="130" textAnchor="middle" fontSize="10" fontWeight="500" className="fill-foreground">{name}</text>
        <text x="120" y="142" textAnchor="middle" fontSize="8" className="fill-muted-foreground">{kind}</text>
        <line x1="82" y1="152" x2="158" y2="152" strokeDasharray="2 2" className="stroke-border" />
        <text x="120" y="166" textAnchor="middle" fontSize="8" className="fill-muted-foreground">{url}</text>

        {links.slice(0, SLOTS.length).map((link, i) => {
          const { y, side } = SLOTS[i]!;
          const right = side === "right";
          const box = right ? 188 : -18;
          const dot = right ? 195 : 45;
          return (
            <g key={i} className="search31-tag" style={{ animationDelay: `${i * 0.8}s` }}>
              <path d={right ? `M170 ${y} L195 ${y}` : `M70 ${y} L45 ${y}`} fill="none" className="stroke-border" />
              <rect x={box} y={y - 9} width="70" height="18" rx="4" className="fill-card stroke-border" />
              <circle cx={dot} cy={y} r="1.8" className="fill-muted stroke-border" />
              <text x={right ? box + 14 : box + 6} y={y + 2.5} fontSize="8" className="fill-muted-foreground">{link}</text>
            </g>
          );
        })}

        {linksLabel && links.length > 0 && (
          <text x="223" y="60" textAnchor="middle" fontSize="8" className="fill-muted-foreground">{linksLabel}</text>
        )}
      </svg>
    </div>
  );
}
