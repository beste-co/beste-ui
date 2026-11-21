"use client";

import { cn } from "@/lib/utils";

interface Dashboard50Props {
  /** The plate on the drawer front, e.g. how many projects it holds */
  label?: string;
  /** A small name on the front folder */
  caption?: string;
  className?: string;
}

export const dashboard50Demo: Dashboard50Props = {
  label: "50 · Pro",
};

const TABS = [56, 84, 112, 140];

const STYLES = `
@keyframes dashboard50-folder { 0%, 4% { opacity: 0; transform: translateY(-14px) } 10%, 84% { opacity: 1; transform: none } 92%, 100% { opacity: 0; transform: none } }
.dashboard50-folder { opacity: 0; animation: dashboard50-folder 13s cubic-bezier(.45,0,.25,1) infinite }
@media (prefers-reduced-motion: reduce) { .dashboard50-folder { animation: none; opacity: 1 } }
`;

export function Dashboard50({ label, caption, className }: Dashboard50Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 220 196" aria-hidden="true" className="w-full max-w-55 overflow-visible">
        <ellipse cx="110" cy="188" rx="80" ry="5" className="fill-foreground/5" />
        {Array.from({ length: 8 }, (_, index) => {
          const y = 23 + index * 7;
          const last = index === 7;
          return (
            <g key={index} className="dashboard50-folder" style={{ animationDelay: `${index * 0.65}s` }}>
              <rect x={TABS[index % 4]} y={y} width="26" height="10" rx="2" className={index === 5 ? "fill-chart-1" : cn(index % 2 ? "fill-background" : "fill-card", "stroke-border")} />
              <rect x="50" y={y + 7} width="120" height="70" rx="3" className={cn(index % 2 ? "fill-background" : "fill-card", "stroke-border")} />
              {last && caption && (
                <text x="58" y={y + 22} fontSize="6.5" className="fill-muted-foreground">
                  {caption}
                </text>
              )}
            </g>
          );
        })}
        <rect x="34" y="100" width="152" height="80" rx="9" className="fill-card stroke-border" />
        <rect x="35" y="101" width="150" height="10" rx="5" className="fill-muted" />
        {label && (
          <>
            <rect x="84" y="122" width="52" height="18" rx="2" className="fill-background stroke-border" />
            <text x="110" y="133.5" textAnchor="middle" fontSize="8" className="fill-muted-foreground">
              {label}
            </text>
          </>
        )}
        <rect x="92" y="153" width="36" height="8" rx="4" className="fill-muted stroke-border" />
      </svg>
    </div>
  );
}
