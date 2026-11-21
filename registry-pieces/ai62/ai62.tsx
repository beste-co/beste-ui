"use client";

import type { ComponentProps } from "react";
import { AiMark } from "@/components/beste/component/ai-mark";
import { cn } from "@/lib/utils";

type LineTone = "soft" | "strong" | "ink";

interface Ai62Props {
  /** The assistant making the call */
  agent?: ComponentProps<typeof AiMark>["brand"];
  /** The tool it calls twice */
  call?: string;
  rejectedLabel?: string;
  savedLabel?: string;
  /** The note on the loop back */
  retryLabel?: string;
  /** How dark the dashed lines and the loop note are: soft on a plain ground, strong in the theme's text color, or a fixed dark ink for light skies and photos */
  lineTone?: LineTone;
  className?: string;
}

const STYLES = `
@keyframes ai62-flow { to { stroke-dashoffset: -32 } }
.ai62-flow { animation: ai62-flow 3s linear infinite }
@media (prefers-reduced-motion: reduce) { .ai62-flow { animation: none } }
`;

const lineStyles: Record<LineTone, string> = {
  soft: "stroke-border",
  strong: "stroke-foreground/45",
  ink: "stroke-neutral-950/55",
};
const noteStyles: Record<LineTone, string> = {
  soft: "text-muted-foreground",
  strong: "text-foreground/75",
  ink: "text-neutral-950/75",
};

export const ai62Demo: Ai62Props = {
  agent: "claude",
  call: "update_section",
  rejectedLabel: "Rejected",
  savedLabel: "Saved to draft",
  retryLabel: "Fix and retry",
};

export function Ai62({ agent = "claude", call, rejectedLabel, savedLabel, retryLabel, lineTone = "soft", className }: Ai62Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <div className="relative h-65 w-75 shrink-0 text-xs">
        <svg viewBox="0 0 300 260" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
          {["M66 44 H160 Q170 44 170 54 V96", "M170 132 V180", "M96 114 H54 Q44 114 44 104 V66"].map((d) => (
            <path key={d} d={d} fill="none" strokeWidth="1.2" strokeDasharray="4 4" className={cn("ai62-flow", lineStyles[lineTone])} />
          ))}
        </svg>
        <div className="absolute top-5.5 left-5.5 flex size-11 items-center justify-center rounded-full bg-card text-foreground/75 shadow-md ring-1 ring-border">
          <AiMark brand={agent} className="size-5" />
        </div>
        {call && (
          <>
            <div className="absolute top-24 left-20.5 flex h-9 items-center gap-2.5 rounded-full bg-card pr-1.5 pl-3.5 whitespace-nowrap shadow-md ring-1 ring-border">
              {call}
              {rejectedLabel && <span className="inline-flex h-6 items-center rounded-full bg-accent px-2.5 text-accent-foreground">{rejectedLabel}</span>}
            </div>
            <div className="absolute top-45 left-20.5 flex h-9 items-center gap-2.5 rounded-full bg-card pr-1.5 pl-3.5 whitespace-nowrap shadow-md ring-1 ring-border">
              {call}
              {savedLabel && <span className="inline-flex h-6 items-center rounded-full bg-emerald-50 px-2.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{savedLabel}</span>}
            </div>
          </>
        )}
        {retryLabel && <span className={cn("absolute top-33 left-4", noteStyles[lineTone])}>{retryLabel}</span>}
      </div>
    </div>
  );
}
