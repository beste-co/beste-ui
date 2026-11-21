"use client";

import { cn } from "@/lib/utils";

interface Dashboard55Props {
  /** Up to four plugins plugged into the strip; they unplug one after another */
  plugins?: string[];
  /** The line that shows once the strip is clear */
  doneLabel?: string;
  className?: string;
}

export const dashboard55Demo: Dashboard55Props = {
  plugins: ["SEO", "Cache", "Backup", "Security"],
  doneLabel: "Updates handled for you",
};

const SOCKETS = [33, 77, 121, 165];
const TIPS = [34, 86, 138, 190];

const STYLES = `
@keyframes dashboard55-p0 { 0%, 16% { opacity: 1; transform: none } 24%, 90% { opacity: 0; transform: translateY(-20px) } 97%, 100% { opacity: 1; transform: none } }
@keyframes dashboard55-p1 { 0%, 25% { opacity: 1; transform: none } 33%, 90% { opacity: 0; transform: translateY(-20px) } 97%, 100% { opacity: 1; transform: none } }
@keyframes dashboard55-p2 { 0%, 34% { opacity: 1; transform: none } 42%, 90% { opacity: 0; transform: translateY(-20px) } 97%, 100% { opacity: 1; transform: none } }
@keyframes dashboard55-p3 { 0%, 43% { opacity: 1; transform: none } 51%, 90% { opacity: 0; transform: translateY(-20px) } 97%, 100% { opacity: 1; transform: none } }
@keyframes dashboard55-done { 0%, 50% { opacity: 0 } 58%, 84% { opacity: 1 } 90%, 100% { opacity: 0 } }
.dashboard55-plug { animation-duration: 13s; animation-timing-function: cubic-bezier(.45,0,.25,1); animation-iteration-count: infinite }
.dashboard55-p0 { animation-name: dashboard55-p0 }
.dashboard55-p1 { animation-name: dashboard55-p1 }
.dashboard55-p2 { animation-name: dashboard55-p2 }
.dashboard55-p3 { animation-name: dashboard55-p3 }
.dashboard55-done { opacity: 0; animation: dashboard55-done 13s ease infinite }
@media (prefers-reduced-motion: reduce) { .dashboard55-plug, .dashboard55-done { animation: none } .dashboard55-plug { opacity: 0 } .dashboard55-done { opacity: 1 } }
`;

export function Dashboard55({ plugins = [], doneLabel, className }: Dashboard55Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="-14 36 268 176" aria-hidden="true" className="w-full max-w-72 overflow-visible">
        <ellipse cx="128" cy="204" rx="104" ry="5" className="fill-foreground/5" />
        <path d="M18 176 C 2 176, 2 198, -14 198" fill="none" className="stroke-muted-foreground/40" />
        <rect x="18" y="150" width="222" height="44" rx="12" className="fill-muted stroke-muted-foreground/40" />
        <rect x="19" y="151" width="220" height="8" rx="5" className="fill-card" />
        {SOCKETS.map((x) => (
          <g key={x}>
            <rect x={x} y="161" width="26" height="22" rx="6" className="fill-card stroke-border" />
            <rect x={x + 7} y="168" width="2.4" height="8" rx="1" className="fill-muted-foreground/60" />
            <rect x={x + 16.6} y="168" width="2.4" height="8" rx="1" className="fill-muted-foreground/60" />
          </g>
        ))}
        <rect x="212" y="162" width="18" height="20" rx="5" className="fill-card stroke-border" />
        {plugins.slice(0, 4).map((plugin, index) => {
          const x = (SOCKETS[index] ?? 0) + 2;
          const plug = x + 11;
          const tip = TIPS[index] ?? 0;
          return (
            <g key={index} className={`dashboard55-plug dashboard55-p${index}`}>
              <path d={`M${plug} 132 C ${plug} 104, ${tip} 92, ${tip} 62`} fill="none" className="stroke-muted-foreground/40" />
              <text x={tip} y="52" textAnchor="middle" fontSize="8.5" className="fill-muted-foreground">
                {plugin}
              </text>
              <rect x={x} y="130" width="22" height="34" rx="5" className="fill-card stroke-muted-foreground/40" />
              <line x1={x + 6} y1="138" x2={x + 16} y2="138" className="stroke-border" />
              <line x1={x + 6} y1="142" x2={x + 16} y2="142" className="stroke-border" />
            </g>
          );
        })}
        {doneLabel && (
          <text x="128" y="128" textAnchor="middle" fontSize="8.5" className="dashboard55-done fill-chart-1">
            {doneLabel}
          </text>
        )}
      </svg>
    </div>
  );
}
