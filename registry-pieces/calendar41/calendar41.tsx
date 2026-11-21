"use client";

import { cn } from "@/lib/utils";

interface Calendar41Page {
  day: string;
  /** The line under the day, e.g. "2026 edition" */
  label?: string;
}

interface Calendar41Props {
  month?: string;
  /** The page that tears away */
  before?: Calendar41Page;
  /** The page underneath, with its line in orange */
  after?: Calendar41Page;
  className?: string;
}

export const calendar41Demo: Calendar41Props = {
  month: "October",
  before: { day: "14", label: "2025 edition" },
  after: { day: "13", label: "2026 edition" },
};

const STYLES = `
@keyframes calendar41-pg { 0%, 30% { opacity: 1; transform: none } 42% { opacity: 1; transform: translate(-46px, -58px) rotate(-18deg) } 48%, 86% { opacity: 0; transform: translate(-52px, -64px) rotate(-20deg) } 87% { opacity: 0; transform: none } 96%, 100% { opacity: 1; transform: none } }
.calendar41-pg { transform-box: fill-box; transform-origin: 50% 0; animation: calendar41-pg 13s cubic-bezier(.45,0,.25,1) -2s infinite }
@media (prefers-reduced-motion: reduce) { .calendar41-pg { animation: none; opacity: 0 } }
`;

function Page({ month, page, accent }: { month?: string; page?: Calendar41Page; accent?: boolean }) {
  return (
    <>
      <rect x="68" y="36" width="104" height="112" rx="5" className="fill-card stroke-muted-foreground/40" />
      <line x1="68" y1="62" x2="172" y2="62" className="stroke-border" />
      {month && (
        <text x="120" y="55" textAnchor="middle" fontSize="7.5" className="fill-muted-foreground">
          {month}
        </text>
      )}
      <text x="120" y="108" textAnchor="middle" fontSize="34" fontWeight="500" letterSpacing="-1" className="fill-foreground">
        {page?.day}
      </text>
      {page?.label && (
        <text x="120" y="132" textAnchor="middle" fontSize="7.5" className={accent ? "fill-chart-1" : "fill-muted-foreground"}>
          {page.label}
        </text>
      )}
    </>
  );
}

export function Calendar41({ month, before, after, className }: Calendar41Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 240 180" aria-hidden="true" className="w-full max-w-60 overflow-visible">
        <ellipse cx="120" cy="170" rx="80" ry="5" className="fill-foreground/5" />
        <path d="M58 160 L72 34 L168 34 L182 160 Z" className="fill-muted stroke-muted-foreground/40" />
        <line x1="75" y1="150" x2="165" y2="150" className="stroke-border" />
        <rect x="64" y="24" width="112" height="14" rx="4" className="fill-muted stroke-muted-foreground/40" />
        <circle cx="96" cy="30" r="2.2" className="fill-card stroke-muted-foreground/50" />
        <circle cx="144" cy="30" r="2.2" className="fill-card stroke-muted-foreground/50" />
        <rect x="70" y="40" width="100" height="112" rx="5" className="fill-card stroke-muted-foreground/40" />
        <rect x="72" y="44" width="96" height="112" rx="5" className="fill-card stroke-border" />
        <g>
          <Page month={month} page={after} accent />
        </g>
        <g className="calendar41-pg">
          <Page month={month} page={before} />
        </g>
      </svg>
    </div>
  );
}
