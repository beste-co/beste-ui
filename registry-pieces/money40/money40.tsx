"use client";

import { cn } from "@/lib/utils";

interface Money40Props {
  /** The line above the drop, e.g. "Buyer pays" */
  label?: string;
  /** The glyph on each coin */
  currency?: string;
  /** The wallet's label */
  account?: string;
  /** A quiet line under it, e.g. the payment providers */
  detail?: string;
  className?: string;
}

export const money40Demo: Money40Props = {
  label: "Buyer pays",
  currency: "€",
  account: "Your account",
  detail: "Stripe · Polar · LemonSqueezy",
};

const STYLES = `
@keyframes money40-drop { 0%, 8% { opacity: 0; transform: translateY(-26px) } 16% { opacity: 1; transform: translateY(-26px) } 30%, 36% { opacity: 1; transform: none } 52% { opacity: 1; transform: translateY(58px) } 54%, 100% { opacity: 0; transform: translateY(58px) } }
@keyframes money40-sit { 0%, 48% { transform: none } 53% { transform: translateY(1.5px) } 60%, 100% { transform: none } }
.money40-coin { opacity: 0; animation: money40-drop 12s cubic-bezier(.45,0,.25,1) infinite }
.money40-later { animation-delay: -6s }
.money40-notes { animation: money40-sit 6s cubic-bezier(.45,0,.25,1) infinite }
@media (prefers-reduced-motion: reduce) { .money40-coin, .money40-notes { animation: none } .money40-coin { opacity: 1; transform: none } .money40-later { opacity: 0 } }
`;

export function Money40({ label, currency = "€", account, detail, className }: Money40Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 240 210" aria-hidden="true" className="w-full max-w-64 overflow-visible">
        <ellipse cx="120" cy="196" rx="84" ry="5" className="fill-foreground/5" />
        {label && (
          <text x="120" y="14" textAnchor="middle" fontSize="8.5" className="fill-muted-foreground">
            {label}
          </text>
        )}
        <line x1="120" y1="22" x2="120" y2="40" strokeDasharray="2 2" className="stroke-muted-foreground/40" />
        <g className="money40-notes">
          <rect x="66" y="78" width="100" height="44" rx="5" transform="rotate(-4 116 100)" className="fill-muted stroke-border" />
          <rect x="78" y="74" width="96" height="44" rx="5" transform="rotate(3 126 96)" className="fill-card stroke-border" />
        </g>
        {["", " money40-later"].map((extra) => (
          <g key={extra} className={`money40-coin${extra}`}>
            <circle cx="120" cy="58" r="12" className="fill-chart-1" />
            <circle cx="120" cy="58" r="8.5" fill="none" className="stroke-white/55" />
            <text x="120" y="61.8" textAnchor="middle" fontSize="11" fontWeight="500" className="fill-white">
              {currency}
            </text>
          </g>
        ))}
        <rect x="52" y="96" width="136" height="92" rx="13" className="fill-card stroke-muted-foreground/40" />
        <rect x="58" y="112" width="124" height="70" rx="9" fill="none" strokeDasharray="2 2" className="stroke-border" />
        <rect x="53" y="97" width="134" height="10" rx="5" className="fill-muted" />
        {account && (
          <text x="64" y="150" fontSize="8.5" className="fill-muted-foreground">
            {account}
          </text>
        )}
        {detail && (
          <text x="64" y="164" fontSize="8" className="fill-foreground/70">
            {detail}
          </text>
        )}
        <path d="M188 128 h-18 a9 9 0 0 0 0 18 h18" className="fill-card stroke-muted-foreground/40" />
        <circle cx="172" cy="137" r="3.5" className="fill-card stroke-muted-foreground/50" />
      </svg>
    </div>
  );
}
