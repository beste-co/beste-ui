"use client";

import { cn } from "@/lib/utils";

interface Browser45Props {
  /** The small line at the top of the certificate */
  label?: string;
  domain?: string;
  validLabel?: string;
  /** The expiry date before renewal */
  before?: string;
  /** The expiry date after renewal */
  after?: string;
  /** The orange line under the new date */
  renewedLabel?: string;
  className?: string;
}

export const browser45Demo: Browser45Props = {
  label: "SSL certificate",
  domain: "orielstudio.pt",
  validLabel: "Valid until",
  before: "12 Mar 2027",
  after: "10 Jun 2027",
  renewedLabel: "Auto-renewed",
};

const STYLES = `
@keyframes browser45-old { 0%, 34% { opacity: 1 } 40%, 90% { opacity: 0 } 96%, 100% { opacity: 1 } }
@keyframes browser45-new { 0%, 42% { opacity: 0; transform: translateY(6px) } 48%, 84% { opacity: 1; transform: none } 90%, 100% { opacity: 0; transform: translateY(6px) } }
@keyframes browser45-seal { 0%, 38% { opacity: 0; transform: scale(1.18) } 48%, 86% { opacity: 1; transform: none } 96%, 100% { opacity: 0; transform: scale(1.18) } }
.browser45-old { animation: browser45-old 12s ease infinite; animation-delay: -3s }
.browser45-new { opacity: 0; transform-box: fill-box; animation: browser45-new 12s cubic-bezier(.3,0,.2,1) infinite; animation-delay: -3s }
.browser45-seal { opacity: 0; transform-box: fill-box; transform-origin: center; animation: browser45-seal 12s cubic-bezier(.3,0,.2,1) infinite; animation-delay: -3s }
@media (prefers-reduced-motion: reduce) { .browser45-old, .browser45-new, .browser45-seal { animation: none } .browser45-old { opacity: 0 } .browser45-new, .browser45-seal { opacity: 1; transform: none } }
`;

export function Browser45({ label, domain, validLabel, before, after, renewedLabel, className }: Browser45Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 240 210" aria-hidden="true" className="w-full max-w-63 overflow-visible">
        <ellipse cx="120" cy="192" rx="84" ry="5" className="fill-foreground/5" />
        <rect x="36" y="26" width="168" height="152" rx="6" className="fill-card stroke-border" />
        <rect x="43" y="33" width="154" height="138" rx="3" className="fill-none stroke-border/60" />
        {label && (
          <text x="120" y="54" textAnchor="middle" fontSize="8.5" className="fill-muted-foreground">
            {label}
          </text>
        )}
        {domain && (
          <text x="120" y="82" textAnchor="middle" fontSize="15" fontWeight="500" className="fill-foreground">
            {domain}
          </text>
        )}
        <line x1="60" y1="96" x2="180" y2="96" strokeDasharray="2 2" className="stroke-border" />
        {validLabel && (
          <text x="60" y="114" fontSize="8" className="fill-muted-foreground">
            {validLabel}
          </text>
        )}
        <g className="browser45-old">
          <text x="60" y="130" fontSize="9" className="fill-muted-foreground">
            {before}
          </text>
        </g>
        <g className="browser45-new">
          <text x="60" y="130" fontSize="9" className="fill-foreground">
            {after}
          </text>
          {renewedLabel && (
            <text x="60" y="146" fontSize="8" className="fill-chart-1">
              {renewedLabel}
            </text>
          )}
        </g>
        <g transform="translate(168 138)">
          <g className="browser45-seal">
            <circle r="23" className="fill-none stroke-chart-1/25" />
            <path d="M-7 13 L-11 30 L-4 26 L0 31 L2 15 M7 13 L11 30 L4 26 L0 31" strokeLinejoin="round" className="fill-none stroke-chart-1" />
            <circle r="16" className="fill-card stroke-chart-1" />
            <circle r="12" strokeDasharray="1.5 2" className="fill-none stroke-chart-1/50" />
            <rect x="-5" y="-1.5" width="10" height="8" rx="1.5" className="fill-none stroke-foreground" />
            <path d="M-3 -1.5 v-2.5 a3 3 0 0 1 6 0 v2.5" className="fill-none stroke-foreground" />
          </g>
        </g>
      </svg>
    </div>
  );
}
