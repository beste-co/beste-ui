"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

interface Notification30Props {
  /** The word on the mailbox */
  label?: string;
  /** The orange line that shows once the flag is up */
  request?: string;
  className?: string;
}

export const notification30Demo: Notification30Props = {
  label: "Lessons",
  request: "New lesson request",
};

const STYLES = `
@keyframes notification30-env { 0%, 10% { opacity: 0; transform: translateY(-34px) } 20%, 34% { opacity: 1; transform: none } 50%, 100% { opacity: 1; transform: translateY(80px) } }
@keyframes notification30-flag { 0%, 46% { transform: rotate(90deg) } 56%, 88% { transform: none } 96%, 100% { transform: rotate(90deg) } }
@keyframes notification30-req { 0%, 52% { opacity: 0; transform: translateY(3px) } 60%, 86% { opacity: 1; transform: none } 94%, 100% { opacity: 0 } }
.notification30-env { animation: notification30-env 11s cubic-bezier(.45,0,.25,1) infinite }
.notification30-flag { transform-box: fill-box; transform-origin: 2px 38px; animation: notification30-flag 11s cubic-bezier(.45,0,.25,1) infinite }
.notification30-req { opacity: 0; animation: notification30-req 11s ease infinite }
@media (prefers-reduced-motion: reduce) { .notification30-env, .notification30-flag, .notification30-req { animation: none } .notification30-env { opacity: 0 } .notification30-req { opacity: 1 } }
`;

export function Notification30({ label, request, className }: Notification30Props) {
  const clip = useId().replace(/:/g, "");
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="50 18 160 228" aria-hidden="true" className="w-full max-w-54 overflow-visible">
        <defs>
          <clipPath id={clip}>
            <rect x="0" y="-60" width="250" height="160" />
          </clipPath>
        </defs>
        <ellipse cx="125" cy="238" rx="70" ry="5" className="fill-foreground/5" />
        <rect x="117" y="150" width="16" height="88" rx="2" className="fill-card stroke-muted-foreground/40" />
        <g clipPath={`url(#${clip})`}>
          <g className="notification30-env">
            <rect x="94" y="30" width="62" height="40" rx="3" className="fill-card stroke-muted-foreground/40" />
            <path d="M94 32 L125 54 L156 32" fill="none" className="stroke-muted-foreground/30" />
          </g>
        </g>
        <path d="M60 152 V118 Q60 92 86 92 H164 Q190 92 190 118 V152 Z" className="fill-card stroke-muted-foreground/40" />
        <path d="M66 152 L66 116 Q66 98 84 98" fill="none" strokeWidth="3" strokeLinecap="round" className="stroke-muted" />
        <rect x="96" y="96" width="58" height="6" rx="3" className="fill-foreground/85" />
        {label && (
          <text x="125" y="130" textAnchor="middle" fontSize="7" className="fill-muted-foreground">
            {label}
          </text>
        )}
        <line x1="56" y1="152" x2="194" y2="152" className="stroke-muted-foreground/40" />
        <g className="notification30-flag">
          <rect x="190" y="104" width="4" height="40" rx="1" className="fill-card stroke-muted-foreground/50" />
          <rect x="194" y="104" width="16" height="12" rx="2" className="fill-chart-1" />
        </g>
        <circle cx="192" cy="142" r="2.2" className="fill-card stroke-muted-foreground/50" />
        {request && (
          <text x="125" y="72" textAnchor="middle" fontSize="7.5" className="notification30-req fill-chart-1">
            {request}
          </text>
        )}
      </svg>
    </div>
  );
}
