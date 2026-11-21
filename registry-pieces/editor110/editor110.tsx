"use client";

import { cn } from "@/lib/utils";

interface Editor110Props {
  title?: string;
  /** Up to three label and value lines on the sign */
  rows?: { label: string; value: string }[];
  /** The orange value on the taped note */
  patch?: string;
  /** The row the note is taped over, by index */
  patchRow?: number;
  className?: string;
}

export const editor110Demo: Editor110Props = {
  title: "Opening hours",
  rows: [
    { label: "Mon to Thu", value: "9 to 17" },
    { label: "Friday", value: "9 to 13" },
  ],
  patch: "8 to 18",
  patchRow: 1,
};

const STYLES = `
@keyframes editor110-note { 0%, 22% { opacity: 0; transform: translate(6px, -14px) rotate(8deg) } 32%, 86% { opacity: 1; transform: rotate(-4deg) } 94%, 100% { opacity: 0; transform: rotate(-4deg) } }
.editor110-note { transform-box: fill-box; transform-origin: 50% 0; opacity: 0; animation: editor110-note 12s cubic-bezier(.3,0,.2,1) infinite }
@media (prefers-reduced-motion: reduce) { .editor110-note { animation: none; opacity: 1; transform: rotate(-4deg) } }
`;

export function Editor110({ title, rows = [], patch, patchRow = 1, className }: Editor110Props) {
  const y = 110 + patchRow * 18;
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="34 6 172 162" aria-hidden="true" className="w-full max-w-48 overflow-visible">
        <circle cx="120" cy="14" r="3" className="fill-card stroke-muted-foreground/50" />
        <path d="M120 15 L66 56 M120 15 L174 56" fill="none" className="stroke-muted-foreground/40" />
        <rect x="44" y="60" width="160" height="104" rx="10" className="fill-foreground/5" />
        <rect x="40" y="54" width="160" height="104" rx="10" className="fill-card stroke-muted-foreground/40" />
        <circle cx="66" cy="62" r="2.4" className="fill-muted stroke-muted-foreground/50" />
        <circle cx="174" cy="62" r="2.4" className="fill-muted stroke-muted-foreground/50" />
        {title && (
          <text x="120" y="82" textAnchor="middle" fontSize="7" className="fill-muted-foreground">
            {title}
          </text>
        )}
        <line x1="56" y1="92" x2="184" y2="92" strokeDasharray="2 2" className="stroke-border" />
        {rows.slice(0, 3).map((row, index) => (
          <g key={index}>
            <text x="56" y={110 + index * 18} fontSize="8" className="fill-muted-foreground">
              {row.label}
            </text>
            <text x="184" y={110 + index * 18} textAnchor="end" fontSize="8" className="fill-foreground">
              {row.value}
            </text>
          </g>
        ))}
        {patch && (
          <g className="editor110-note">
            <rect x="140" y={y - 13} width="52" height="20" rx="1.5" className="fill-muted stroke-muted-foreground/40" />
            <rect x="156" y={y - 17} width="20" height="8" rx="1" className="fill-muted-foreground/25" />
            <text x="166" y={y + 1} textAnchor="middle" fontSize="8.5" className="fill-chart-1">
              {patch}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
