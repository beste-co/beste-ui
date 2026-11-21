"use client";

import { cn } from "@/lib/utils";

interface Money34Props {
  /** Tickets in the monthly group, torn off one after another */
  monthly?: number;
  /** Tickets in the purchased group, which stay put */
  purchased?: number;
  /** The value printed on each ticket */
  unit?: string;
  monthlyLabel?: string;
  purchasedLabel?: string;
  className?: string;
}

export const money34Demo: Money34Props = {
  monthly: 6,
  purchased: 3,
  unit: "1",
  monthlyLabel: "Monthly, used first",
  purchasedLabel: "Purchased, no expiry",
};

const STYLES = `
@keyframes money34-tear { 0%, 30% { opacity: 1; transform: none; } 38%, 84% { opacity: 0; transform: translate(4px, -12px) rotate(-8deg); } 92%, 100% { opacity: 1; transform: none; } }
.money34-tear { transform-box: fill-box; transform-origin: 50% 100%; animation: money34-tear 12s cubic-bezier(.45,0,.25,1) infinite; }
@media (prefers-reduced-motion: reduce) { .money34-tear { animation: none; } }
`;

const PITCH = 32;
const GAP = 16;

// A 28 by 48 ticket with a notch on each side at the perforation
const ticket = (x: number) =>
  `M${x + 3} 2h22a3 3 0 0 1 3 3v12a3 3 0 0 0 0 6v25a3 3 0 0 1-3 3h-22a3 3 0 0 1-3-3v-25a3 3 0 0 0 0-6v-12a3 3 0 0 1 3-3z`;

export function Money34({ monthly = 6, purchased = 3, unit, monthlyLabel, purchasedLabel, className }: Money34Props) {
  const monthlyEnd = 3 + monthly * PITCH - 4;
  const purchasedStart = monthlyEnd + GAP;
  const purchasedEnd = purchasedStart + purchased * PITCH - 4;
  const width = purchasedEnd + 7;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox={`0 -4 ${width} 98`} aria-hidden="true" className="h-auto w-full max-w-92 overflow-visible">
        {Array.from({ length: monthly }, (_, index) => {
          const x = 3 + index * PITCH;
          return (
            <g key={`m${index}`} className="money34-tear" style={{ animationDelay: `${-(monthly - 1 - index) * 0.6}s` }}>
              <path d={ticket(x)} className="fill-muted stroke-foreground/25" />
              <line x1={x + 5} y1={20} x2={x + 23} y2={20} strokeDasharray="2 2" className="stroke-foreground/20" />
              <text x={x + 14} y={40} textAnchor="middle" fontSize={8} className="fill-muted-foreground">
                {unit}
              </text>
            </g>
          );
        })}
        {Array.from({ length: purchased }, (_, index) => {
          const x = purchasedStart + index * PITCH;
          return (
            <g key={`p${index}`}>
              <path d={ticket(x)} className="fill-accent stroke-chart-1" />
              <line x1={x + 5} y1={20} x2={x + 23} y2={20} strokeDasharray="2 2" className="stroke-chart-1/50" />
              <text x={x + 14} y={40} textAnchor="middle" fontSize={8} className="fill-chart-1">
                {unit}
              </text>
            </g>
          );
        })}
        <path d={`M3 62v4H${monthlyEnd}v-4`} fill="none" className="stroke-foreground/20" />
        <path d={`M${purchasedStart} 62v4H${purchasedEnd}v-4`} fill="none" className="stroke-chart-1/50" />
        {monthlyLabel && (
          <text x={3} y={82} fontSize={9} className="fill-muted-foreground">
            {monthlyLabel}
          </text>
        )}
        {purchasedLabel && (
          <text x={purchasedEnd} y={82} textAnchor="end" fontSize={9} className="fill-chart-1">
            {purchasedLabel}
          </text>
        )}
      </svg>
    </div>
  );
}
