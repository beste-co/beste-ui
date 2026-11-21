"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Money36Props {
  /** The caption inside the tank */
  label?: string;
  /** Three projects fed from the tank */
  projects?: [string, string, string];
  /** The busy project, which draws more often */
  active?: number;
  className?: string;
}

export const money36Demo: Money36Props = {
  label: "Shared credits",
  projects: ["Aurora", "Harborfront", "Villalobos"],
  active: 1,
};

const XS = [40, 110, 180];

const STYLES = `
@keyframes money36-drip { 0% { opacity: 0; transform: none } 12% { opacity: 1 } 70% { opacity: 1; transform: translateY(20px) } 80%, 100% { opacity: 0; transform: translateY(20px) } }
.money36-drip { opacity: 0; animation: money36-drip 12s cubic-bezier(.4,0,.6,1) infinite }
.money36-fast { animation-duration: 4s }
@media (prefers-reduced-motion: reduce) { .money36-drip { animation: none; opacity: 1; transform: translateY(10px) } .money36-echo { opacity: 0 } }
`;

export function Money36({ label, projects = ["", "", ""], active = 1, className }: Money36Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 220 190" aria-hidden="true" className="w-full max-w-55 overflow-visible">
        <ellipse cx="110" cy="182" rx="96" ry="4.5" className="fill-foreground/5" />
        <path d="M110 96 V114 M40 114 H180 M40 114 V146 M110 114 V146 M180 114 V146" fill="none" strokeWidth="5" className="stroke-muted" />
        <path d="M110 96 V114 M40 114 H180 M40 114 V146 M110 114 V146 M180 114 V146" fill="none" className="stroke-border" />
        <rect x="70" y="16" width="80" height="80" rx="10" className="fill-card stroke-border" />
        <path d="M71 46 H149 V86 Q149 95 140 95 H80 Q71 95 71 86 Z" className="fill-chart-1/10" />
        <line x1="71" y1="46" x2="149" y2="46" className="stroke-chart-1/70" />
        {label && (
          <text x="110" y="34" textAnchor="middle" fontSize="8" className="fill-muted-foreground">
            {label}
          </text>
        )}
        {Array.from({ length: 9 }, (_, index) => (
          <line key={index} x1="154" y1={24 + index * 8} x2={index % 2 ? 156 : 158} y2={24 + index * 8} className="stroke-border" />
        ))}
        {XS.map((x, index) => (
          <Fragment key={index}>
            {index === active ? (
              <>
                <circle cx={x} cy="122" r="2.2" className="money36-drip money36-fast fill-chart-1" />
                <circle cx={x} cy="122" r="2.2" className="money36-drip money36-fast money36-echo fill-chart-1" style={{ animationDelay: "-2s" }} />
              </>
            ) : (
              <circle cx={x} cy="122" r="2.2" className="money36-drip fill-chart-1" style={{ animationDelay: index === 0 ? "-2s" : "-8s" }} />
            )}
            <rect x={x - 32} y="146" width="64" height="28" rx="6" className={cn("fill-card", index === active ? "stroke-chart-1" : "stroke-border")} />
            <text x={x} y="163" textAnchor="middle" fontSize="8" className={index === active ? "fill-foreground" : "fill-muted-foreground"}>
              {projects[index]}
            </text>
          </Fragment>
        ))}
      </svg>
    </div>
  );
}
