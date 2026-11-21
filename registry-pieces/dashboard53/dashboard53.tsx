"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

interface Dashboard53Side {
  /** The organization's square image; without it a letter chip */
  image?: string;
  initial?: string;
  name: string;
  /** A quiet line under the name, e.g. a domain */
  detail?: string;
  role?: string;
  /** Small print at the foot of the badge */
  note?: string;
}

interface Dashboard53Props {
  /** The project the badge opens, the same on both sides */
  title?: string;
  /** Who holds the badge first */
  before?: Dashboard53Side;
  /** Who holds it after the handover */
  after?: Dashboard53Side;
  className?: string;
}

export const dashboard53Demo: Dashboard53Props = {
  title: "Harborfront site",
  before: { image: "https://oud.pics/b/gradients/gradient-silk-slate.webp", name: "Northfold", role: "Guest" },
  after: { image: "https://oud.pics/b/gradients/gradient-silk-sage.webp", name: "Harborfront", role: "Owner" },
};

const STYLES = `
@keyframes dashboard53-a { 0%, 34% { opacity: 1 } 40%, 91% { opacity: 0 } 97%, 100% { opacity: 1 } }
@keyframes dashboard53-b { 0%, 41% { opacity: 0; transform: translateY(6px) } 48%, 84% { opacity: 1; transform: none } 90%, 100% { opacity: 0; transform: translateY(6px) } }
@keyframes dashboard53-swing { 0%, 100% { transform: rotate(-1.6deg) } 50% { transform: rotate(1.6deg) } }
.dashboard53-a { animation: dashboard53-a 12s ease infinite }
.dashboard53-b { opacity: 0; animation: dashboard53-b 12s cubic-bezier(.45,0,.25,1) infinite }
.dashboard53-swing { transform-box: view-box; transform-origin: 120px 50px; animation: dashboard53-swing 12s ease-in-out infinite }
@media (prefers-reduced-motion: reduce) {
  .dashboard53-a, .dashboard53-b, .dashboard53-swing { animation: none }
  .dashboard53-a { opacity: 0 }
  .dashboard53-b { opacity: 1 }
}
`;

function Side({ side, dark, clip, className }: { side: Dashboard53Side; dark?: boolean; clip: string; className: string }) {
  return (
    <g className={className}>
      {side.image ? (
        <image href={side.image} x="72" y="94" width="22" height="22" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clip})`} />
      ) : (
        <>
          <rect x="72" y="94" width="22" height="22" rx="6" className={dark ? "fill-neutral-800" : "fill-muted"} />
          <text x="83" y="108.5" textAnchor="middle" fontSize="11" fontWeight="600" className={dark ? "fill-white" : "fill-muted-foreground"}>
            {side.initial ?? side.name.charAt(0)}
          </text>
        </>
      )}
      <text x="102" y={side.detail ? 103 : 108} fontSize="9" fontWeight="500" className="fill-foreground">
        {side.name}
      </text>
      {side.detail && (
        <text x="102" y="113" fontSize="6.5" className="fill-muted-foreground">
          {side.detail}
        </text>
      )}
      {side.role && (
        <text x="72" y="146" fontSize="8" className="fill-muted-foreground">
          {side.role}
        </text>
      )}
      {side.note && (
        <text x="72" y="180" fontSize="6.5" className="fill-muted-foreground">
          {side.note}
        </text>
      )}
    </g>
  );
}

export function Dashboard53({ title, before, after, className }: Dashboard53Props) {
  const clip = `dashboard53-clip-${useId().replace(/:/g, "")}`;
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 240 214" aria-hidden="true" className="w-full max-w-69 overflow-visible">
        <defs>
          <clipPath id={clip}>
            <rect x="72" y="94" width="22" height="22" rx="6" />
          </clipPath>
        </defs>
        <ellipse cx="120" cy="206" rx="62" ry="4.5" className="fill-foreground/5" />
        <path d="M90 -6 L99 -6 L118 44 L112 44 Z" className="fill-card stroke-border" />
        <path d="M150 -6 L141 -6 L128 44 L122 44 Z" className="fill-card stroke-border" />
        <g className="dashboard53-swing">
          <rect x="111" y="40" width="18" height="12" rx="3" className="fill-card stroke-border" />
          <circle cx="120" cy="58" r="4" fill="none" className="stroke-border" />
          <rect x="58" y="62" width="124" height="136" rx="11" className="fill-card stroke-border" />
          <rect x="59" y="63" width="122" height="22" rx="10" className="fill-background" />
          <rect x="105" y="70" width="30" height="6" rx="3" className="fill-muted stroke-border" />
          {before && <Side side={before} dark clip={clip} className={after ? "dashboard53-a" : ""} />}
          {after && <Side side={after} clip={clip} className={before ? "dashboard53-b" : ""} />}
          <line x1="72" y1="128" x2="168" y2="128" strokeDasharray="2 2" className="stroke-border" />
          {title && (
            <text x="72" y="164" fontSize="11" fontWeight="500" className="fill-foreground">
              {title}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}
