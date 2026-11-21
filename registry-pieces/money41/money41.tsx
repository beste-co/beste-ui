"use client";

import { cn } from "@/lib/utils";

interface Money41Props {
  /** The quiet line on the tag, e.g. "Course" */
  label?: string;
  title?: string;
  /** The word on the stub that tears away */
  fee?: string;
  /** A quiet line that shows once the stub is gone */
  note?: string;
  className?: string;
}

export const money41Demo: Money41Props = {
  title: "Spanish B1",
  fee: "Fee",
  note: "All of it stays yours",
};

// The torn perforation, top to bottom; the tag and the stub share it so they meet without a gap
const TEAR = Array.from({ length: 29 }, (_, i) => `${i % 2 ? 161.6 : 160} ${72 + i * 2}`).join(" L");
const TEAR_UP = Array.from({ length: 29 }, (_, i) => `${(28 - i) % 2 ? 161.6 : 160} ${128 - i * 2}`).join(" L");

const STYLES = `
@keyframes money41-stub {
  0%, 20% { opacity: 1; transform: translate(0, 0) rotate(0deg); animation-timing-function: ease-out }
  23% { transform: translate(0, 0) rotate(1.5deg); animation-timing-function: ease-in-out }
  25% { transform: translate(0, 0) rotate(.6deg); animation-timing-function: cubic-bezier(.2,.8,.3,1) }
  28% { transform: translate(0, 0) rotate(5deg) }
  30% { transform: translate(0, 0) rotate(5.5deg); animation-timing-function: cubic-bezier(.2,.8,.3,1) }
  33% { transform: translate(0, 0) rotate(11deg) }
  35% { transform: translate(0, 0) rotate(11.5deg); animation-timing-function: cubic-bezier(.2,.8,.3,1) }
  38% { opacity: 1; transform: translate(1px, 1px) rotate(19deg); animation-timing-function: cubic-bezier(.55,0,1,.45) }
  47% { opacity: 1 }
  50% { opacity: 0; transform: translate(18px, 86px) rotate(58deg) }
  86% { opacity: 0; transform: translate(26px, 0) rotate(0deg); animation-timing-function: cubic-bezier(.2,.7,.2,1) }
  94%, 100% { opacity: 1; transform: translate(0, 0) rotate(0deg) }
}
@keyframes money41-perf { 0%, 23% { opacity: 1 } 25%, 88% { opacity: 0 } 94%, 100% { opacity: 1 } }
@keyframes money41-edge { 0%, 23% { opacity: 0 } 25%, 88% { opacity: 1 } 94%, 100% { opacity: 0 } }
@keyframes money41-stub-edge { 0%, 23% { opacity: 0 } 25%, 84% { opacity: 1 } 85%, 100% { opacity: 0 } }
@keyframes money41-note { 0%, 46% { opacity: 0 } 54%, 80% { opacity: 1 } 86%, 100% { opacity: 0 } }
.money41-stub { transform-box: fill-box; transform-origin: 0 100%; animation: money41-stub 10s infinite }
.money41-perf { animation: money41-perf 10s ease infinite }
.money41-edge { opacity: 0; animation: money41-edge 10s ease infinite }
.money41-stub-edge { opacity: 0; animation: money41-stub-edge 10s ease infinite }
.money41-note { opacity: 0; animation: money41-note 10s ease infinite }
@media (prefers-reduced-motion: reduce) {
  .money41-stub, .money41-perf, .money41-edge, .money41-stub-edge, .money41-note { animation: none }
  .money41-stub, .money41-perf { opacity: 0 }
  .money41-edge, .money41-note { opacity: 1 }
}
`;

export function Money41({ label, title, fee, note, className }: Money41Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="36 16 186 168" aria-hidden="true" className="w-full max-w-56 overflow-visible">
        <ellipse cx="128" cy="178" rx="84" ry="5" className="fill-foreground/5" />
        <g transform="rotate(-7 125 100)">
          <path d={`M50 100 L74 72 L${TEAR} L74 128 Z`} className="fill-card" />
          <path d="M160 72 L74 72 L50 100 L74 128 L160 128" fill="none" strokeLinejoin="round" className="stroke-muted-foreground/40" />
          <path d={`M${TEAR}`} fill="none" strokeLinejoin="round" className="money41-edge stroke-muted-foreground/40" />
          <circle cx="70" cy="100" r="4" className="fill-muted stroke-muted-foreground/40" />
          <path d="M70 100 C 58 74, 40 62, 46 42 C 50 30, 66 32, 64 46" fill="none" className="stroke-muted-foreground/40" />
          {label && (
            <text x="86" y="94" fontSize="7" className="fill-muted-foreground">
              {label}
            </text>
          )}
          {title && (
            <text x="86" y="112" fontSize="14" fontWeight="500" className="fill-foreground">
              {title}
            </text>
          )}
          <line x1="160" y1="74" x2="160" y2="126" strokeDasharray="3 3" className="money41-perf stroke-muted-foreground/40" />
          <g className="money41-stub">
            <path d={`M160 72 H200 Q206 72 206 78 V122 Q206 128 200 128 H160 L${TEAR_UP} Z`} className="fill-accent" />
            <path d="M160 72 H200 Q206 72 206 78 V122 Q206 128 200 128 H160" fill="none" className="stroke-chart-1/50" />
            <path d={`M${TEAR}`} fill="none" strokeLinejoin="round" className="money41-stub-edge stroke-chart-1/50" />
            {fee && (
              <text x="183" y="103" textAnchor="middle" fontSize="7.5" className="fill-chart-1">
                {fee}
              </text>
            )}
          </g>
        </g>
        {note && (
          <text x="125" y="160" textAnchor="middle" fontSize="7.5" className="money41-note fill-muted-foreground">
            {note}
          </text>
        )}
      </svg>
    </div>
  );
}
