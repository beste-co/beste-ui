"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

interface Money39Row {
  label: string;
  value: string;
  /** The latest charge, picked out in orange */
  accent?: boolean;
}

interface Money39Props {
  title?: string;
  /** Up to four lines on the slip, top to bottom */
  rows?: Money39Row[];
  className?: string;
}

export const money39Demo: Money39Props = {
  title: "Invoice",
  rows: [
    { label: "Website", value: "$3,000" },
    { label: "Update", value: "$500" },
    { label: "Update", value: "$500" },
    { label: "Update", value: "$500", accent: true },
  ],
};

const STYLES = `
@keyframes money39-print { 0%, 8% { transform: translateY(142px); opacity: 1 } 16%, 26% { transform: translateY(82px) } 34%, 44% { transform: translateY(62px) } 52%, 62% { transform: translateY(42px) } 70%, 90% { transform: translateY(22px); opacity: 1 } 96% { transform: translateY(22px); opacity: 0 } 100% { transform: translateY(142px); opacity: 0 } }
.money39-print { transform: translateY(22px); animation: money39-print 14s cubic-bezier(.45,0,.25,1) infinite }
@media (prefers-reduced-motion: reduce) { .money39-print { animation: none } }
`;

export function Money39({ title, rows = [], className }: Money39Props) {
  const lines = rows.slice(0, 4);
  const clip = `money39-slot-${useId().replace(/:/g, "")}`;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 240 210" className="h-auto w-full max-w-63 overflow-visible" aria-hidden="true">
        <defs>
          <clipPath id={clip}>
            <rect x="0" y="-20" width="240" height="170" />
          </clipPath>
        </defs>
        <ellipse cx="120" cy="201" rx="86" ry="5" className="fill-foreground/5" />
        <g clipPath={`url(#${clip})`}>
          <g className="money39-print">
            <path d="M74 0 H166 a4 4 0 0 1 4 4 V146 H70 V4 a4 4 0 0 1 4 -4 Z" className="fill-card stroke-muted-foreground/40" />
            {title && (
              <text x="120" y="22" textAnchor="middle" fontSize="7.5" className="fill-muted-foreground">
                {title}
              </text>
            )}
            <line x1="80" y1="34" x2="160" y2="34" strokeDasharray="2 2" className="stroke-border" />
            {lines.map((row, index) => (
              <g key={index}>
                <text x="80" y={52 + index * 20} fontSize="7.5" className="fill-muted-foreground">
                  {row.label}
                </text>
                <text x="160" y={52 + index * 20} textAnchor="end" fontSize="7.5" className={row.accent ? "fill-chart-1" : "fill-foreground"}>
                  {row.value}
                </text>
              </g>
            ))}
            <line x1="80" y1="128" x2="160" y2="128" strokeDasharray="2 2" className="stroke-border" />
          </g>
        </g>
        <rect x="38" y="148" width="164" height="50" rx="13" className="fill-card stroke-muted-foreground/40" />
        <rect x="39" y="149" width="162" height="11" rx="5.5" className="fill-muted" />
        <rect x="62" y="146" width="116" height="6" rx="3" className="fill-foreground" />
        <line x1="56" y1="178" x2="108" y2="178" strokeWidth="2" strokeLinecap="round" className="stroke-border" />
        <line x1="56" y1="186" x2="88" y2="186" strokeWidth="2" strokeLinecap="round" className="stroke-border" />
      </svg>
    </div>
  );
}
