"use client";

import { cn } from "@/lib/utils";

interface Editor90Props {
  /** Names of the three pages that repeat the value, left to right */
  pages?: [string, string, string];
  /** The value before the change */
  before?: string;
  /** The value the stamp leaves on every page */
  after?: string;
  className?: string;
}

export const editor90Demo: Editor90Props = {
  pages: ["Pricing", "Footer", "FAQ"],
  before: "From $45",
  after: "From $49",
};

const STYLES = `
@keyframes editor90-stamp { 0%, 4% { transform: translate(66px, 0px) } 9% { transform: translate(66px, 93px) } 13% { transform: translate(66px, 0px) } 22% { transform: translate(180px, 0px) } 27% { transform: translate(180px, 93px) } 31% { transform: translate(180px, 0px) } 40% { transform: translate(294px, 0px) } 45% { transform: translate(294px, 93px) } 49%, 84% { transform: translate(294px, 0px) } 96%, 100% { transform: translate(66px, 0px) } }
.editor90-stamp { transform: translate(294px, 0px); animation: editor90-stamp 12s cubic-bezier(.45,0,.25,1) infinite }
@keyframes editor90-o1 { 0%, 8% { opacity: 1 } 9.5%, 94% { opacity: 0 } 97%, 100% { opacity: 1 } }
@keyframes editor90-n1 { 0%, 10.5% { opacity: 0 } 12%, 90% { opacity: 1 } 93%, 100% { opacity: 0 } }
@keyframes editor90-o2 { 0%, 26% { opacity: 1 } 27.5%, 94% { opacity: 0 } 97%, 100% { opacity: 1 } }
@keyframes editor90-n2 { 0%, 28.5% { opacity: 0 } 30%, 90% { opacity: 1 } 93%, 100% { opacity: 0 } }
@keyframes editor90-o3 { 0%, 44% { opacity: 1 } 45.5%, 94% { opacity: 0 } 97%, 100% { opacity: 1 } }
@keyframes editor90-n3 { 0%, 46.5% { opacity: 0 } 48%, 90% { opacity: 1 } 93%, 100% { opacity: 0 } }
.editor90-old { opacity: 0 }
.editor90-o1 { animation: editor90-o1 12s ease infinite } .editor90-n1 { animation: editor90-n1 12s ease infinite }
.editor90-o2 { animation: editor90-o2 12s ease infinite } .editor90-n2 { animation: editor90-n2 12s ease infinite }
.editor90-o3 { animation: editor90-o3 12s ease infinite } .editor90-n3 { animation: editor90-n3 12s ease infinite }
@media (prefers-reduced-motion: reduce) {
  .editor90-stamp, .editor90-o1, .editor90-n1, .editor90-o2, .editor90-n2, .editor90-o3, .editor90-n3 { animation: none }
}
`;

const COLUMNS = [21, 135, 249];

export function Editor90({ pages = ["Pricing", "Footer", "FAQ"], before, after, className }: Editor90Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 360 272" fill="none" aria-hidden="true" className="h-auto w-full max-w-72 overflow-visible">
        <ellipse cx="180" cy="264" rx="168" ry="6" className="fill-foreground/5" />
        {COLUMNS.map((x, index) => (
          <g key={x}>
            <rect x={x} y="138" width="90" height="120" rx="4.5" className="fill-background stroke-border" />
            <text x={x + 12} y="159" className="fill-muted-foreground text-xs">
              {pages[index]}
            </text>
            <line x1={x + 12} y1="168" x2={x + 78} y2="168" className="stroke-border" />
            <rect x={x + 9} y="184.5" width="72" height="27" rx="4.5" className="fill-card stroke-border" />
            <rect x={x + 9} y="184.5" width="72" height="27" rx="4.5" className={cn("fill-accent stroke-chart-1", `editor90-n${index + 1}`)} />
            <text x={x + 45} y="202.5" textAnchor="middle" className={cn("editor90-old fill-muted-foreground text-xs", `editor90-o${index + 1}`)}>
              {before}
            </text>
            <text x={x + 45} y="202.5" textAnchor="middle" className={cn("fill-chart-1 text-xs font-medium", `editor90-n${index + 1}`)}>
              {after}
            </text>
            <line x1={x + 12} y1="228" x2={x + 75} y2="228" className="stroke-border" />
            <line x1={x + 12} y1="240" x2={x + 60} y2="240" className="stroke-border" />
          </g>
        ))}
        <g className="editor90-stamp">
          <circle cx="0" cy="27" r="12" className="fill-card stroke-muted-foreground/40" />
          <path d="M-6 39 h12 v15 h-12 z" className="fill-card stroke-muted-foreground/40" />
          <rect x="-27" y="54" width="54" height="27" rx="6" className="fill-card stroke-muted-foreground/40" />
          <line x1="-19.5" y1="61.5" x2="19.5" y2="61.5" className="stroke-border" />
          <rect x="-31.5" y="81" width="63" height="9" rx="2.25" className="fill-card stroke-muted-foreground/40" />
          <rect x="-28.5" y="88.5" width="57" height="3" rx="1.5" className="fill-chart-1" />
        </g>
      </svg>
    </div>
  );
}
