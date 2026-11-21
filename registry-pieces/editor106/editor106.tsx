"use client";

import { cn } from "@/lib/utils";

interface Editor106Props {
  onLabel?: string;
  offLabel?: string;
  /** The plate under the switch, naming what it controls */
  label?: string;
  className?: string;
}

export const editor106Demo: Editor106Props = {
  onLabel: "On",
  offLabel: "Off",
  label: "Every section",
};

const STYLES = `
@keyframes editor106-up { 0%, 40% { opacity: 1 } 48%, 90% { opacity: 0 } 98%, 100% { opacity: 1 } }
@keyframes editor106-down { 0%, 40% { opacity: 0 } 48%, 90% { opacity: 1 } 98%, 100% { opacity: 0 } }
.editor106-up { animation: editor106-up 11s ease -2s infinite }
.editor106-down { opacity: 0; animation: editor106-down 11s ease -2s infinite }
@media (prefers-reduced-motion: reduce) { .editor106-up, .editor106-down { animation: none } .editor106-up { opacity: 0 } .editor106-down { opacity: 1 } }
`;

function Screw({ y }: { y: number }) {
  return (
    <>
      <circle cx="120" cy={y} r="3.5" className="fill-background stroke-border" />
      <line x1="117.6" y1={y} x2="122.4" y2={y} className="stroke-muted-foreground/40" />
    </>
  );
}

export function Editor106({ onLabel, offLabel, label, className }: Editor106Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 240 210" aria-hidden="true" className="w-full max-w-64 overflow-visible">
        <rect x="79" y="17" width="88" height="156" rx="14" className="fill-foreground/5" />
        <rect x="76.5" y="12.5" width="87" height="155" rx="14" className="fill-card stroke-border" />
        <rect x="77" y="13" width="86" height="12" rx="6" className="fill-muted/60" />
        <Screw y={30} />
        <Screw y={150} />
        {onLabel && (
          <text x="120" y="48" textAnchor="middle" fontSize="8.5" className="fill-muted-foreground">
            {onLabel}
          </text>
        )}
        {offLabel && (
          <text x="120" y="138" textAnchor="middle" fontSize="8.5" className="fill-muted-foreground">
            {offLabel}
          </text>
        )}
        <rect x="100.5" y="56.5" width="39" height="69" rx="7" className="fill-background stroke-border" />
        <g className="editor106-up">
          <rect x="104.5" y="60.5" width="31" height="61" rx="5" className="fill-card stroke-border" />
          <rect x="105" y="61" width="30" height="30" rx="4" className="fill-muted" />
          <line x1="106" y1="91" x2="134" y2="91" className="stroke-border" />
        </g>
        <g className="editor106-down">
          <rect x="104.5" y="60.5" width="31" height="61" rx="5" className="fill-card stroke-border" />
          <rect x="105" y="91" width="30" height="30" rx="4" className="fill-muted" />
          <line x1="106" y1="91" x2="134" y2="91" className="stroke-border" />
          <circle cx="120" cy="72" r="2.6" className="fill-muted-foreground/30" />
        </g>
        {label && (
          <>
            <rect x="74.5" y="182.5" width="91" height="16" rx="3" className="fill-card stroke-border" />
            <text x="120" y="193.5" textAnchor="middle" fontSize="8.5" className="fill-muted-foreground">
              {label}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
